export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized. Please login.',
    })
  }

  const orderId = getRouterParam(event, 'id')
  const { action, reason } = await readBody(event)

  if (!orderId || !action) {
    throw createError({
      statusCode: 400,
      message: 'Order ID and action are required',
    })
  }

  try {
    const order = await OrderSchema.findById(orderId).populate('storeId')
    
    if (!order) {
      throw createError({
        statusCode: 404,
        message: 'Order not found',
      })
    }

    // Check if user is store owner
    if (session.user.role !== 'store') {
      throw createError({
        statusCode: 403,
        message: 'Only store owners can manage orders',
      })
    }

    // Get store for this user
    const store = await StoreSchema.findOne({ userId: session.user.id })
    if (!store || store._id.toString() !== order.storeId._id.toString()) {
      throw createError({
        statusCode: 403,
        message: 'You can only manage orders for your own store',
      })
    }

    let updatedOrder

    switch (action) {
      case 'confirm':
        if (order.status !== 'pending') {
          throw createError({
            statusCode: 400,
            message: 'Only pending orders can be confirmed',
          })
        }
        updatedOrder = await OrderSchema.findByIdAndUpdate(
          orderId,
          {
            status: 'confirmed',
            confirmedAt: new Date(),
          },
          { new: true }
        )
        break

      case 'ready':
        if (order.status !== 'confirmed') {
          throw createError({
            statusCode: 400,
            message: 'Only confirmed orders can be marked as ready',
          })
        }
        updatedOrder = await OrderSchema.findByIdAndUpdate(
          orderId,
          {
            status: 'ready',
            readyAt: new Date(),
          },
          { new: true }
        )
        break

      case 'complete':
        if (order.status !== 'ready' && order.status !== 'confirmed') {
          throw createError({
            statusCode: 400,
            message: 'Only ready or confirmed orders can be completed',
          })
        }
        updatedOrder = await OrderSchema.findByIdAndUpdate(
          orderId,
          {
            status: 'completed',
            completedAt: new Date(),
          },
          { new: true }
        )
        break

      case 'cancel':
        if (order.status === 'completed') {
          throw createError({
            statusCode: 400,
            message: 'Completed orders cannot be cancelled',
          })
        }
        
        // Restore product quantity
        await ProductSchema.findByIdAndUpdate(order.productId, {
          $inc: { quantity: order.quantity },
        })

        updatedOrder = await OrderSchema.findByIdAndUpdate(
          orderId,
          {
            status: 'cancelled',
            cancelledAt: new Date(),
            cancellationReason: reason || 'Cancelled by store',
          },
          { new: true }
        )
        break

      default:
        throw createError({
          statusCode: 400,
          message: 'Invalid action',
        })
    }

    return {
      success: true,
      order: updatedOrder,
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update order',
    })
  }
})
