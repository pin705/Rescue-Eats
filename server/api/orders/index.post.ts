export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized. Please login.',
    })
  }

  const { productId, quantity } = await readBody(event)

  if (!productId || !quantity) {
    throw createError({
      statusCode: 400,
      message: 'Product ID and quantity are required',
    })
  }

  try {
    // Get product
    const product = await ProductSchema.findById(productId)
    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Product not found',
      })
    }

    // Check availability
    if (product.status !== 'active') {
      throw createError({
        statusCode: 400,
        message: 'Product is not available',
      })
    }

    if (product.quantity < quantity) {
      throw createError({
        statusCode: 400,
        message: `Only ${product.quantity} items available`,
      })
    }

    // Check if not expired
    if (new Date(product.expiryDate) <= new Date()) {
      throw createError({
        statusCode: 400,
        message: 'Product has expired',
      })
    }

    // Create order with unique voucher code
    const order = await OrderSchema.create({
      userId: session.user.id,
      productId: product._id,
      storeId: product.storeId,
      quantity: Number(quantity),
      totalPrice: product.discountedPrice * quantity,
      productSnapshot: {
        name: product.name,
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice,
        discountPercentage: product.discountPercentage,
        expiryDate: product.expiryDate,
      },
    })

    // Update product quantity
    await ProductSchema.findByIdAndUpdate(productId, {
      $inc: { quantity: -quantity },
      status: product.quantity - quantity === 0 ? 'sold-out' : 'active',
    })

    return {
      success: true,
      order: {
        id: order._id,
        voucherCode: order.voucherCode,
        totalPrice: order.totalPrice,
        quantity: order.quantity,
        expiresAt: order.expiresAt,
      },
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create reservation',
    })
  }
})
