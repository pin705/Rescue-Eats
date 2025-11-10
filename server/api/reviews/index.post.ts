export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized. Please login.',
    })
  }

  const { orderId, rating, comment } = await readBody(event)

  if (!orderId || !rating) {
    throw createError({
      statusCode: 400,
      message: 'Order ID and rating are required',
    })
  }

  if (rating < 1 || rating > 5) {
    throw createError({
      statusCode: 400,
      message: 'Rating must be between 1 and 5',
    })
  }

  try {
    // Get order
    const order = await OrderSchema.findById(orderId)
    if (!order) {
      throw createError({
        statusCode: 404,
        message: 'Order not found',
      })
    }

    // Check if order belongs to user
    if (order.userId.toString() !== session.user.id) {
      throw createError({
        statusCode: 403,
        message: 'You can only review your own orders',
      })
    }

    // Check if order is completed
    if (order.status !== 'completed') {
      throw createError({
        statusCode: 400,
        message: 'You can only review completed orders',
      })
    }

    // Check if already reviewed
    const existingReview = await ReviewSchema.findOne({ orderId })
    if (existingReview) {
      throw createError({
        statusCode: 400,
        message: 'You have already reviewed this order',
      })
    }

    // Create review
    const review = await ReviewSchema.create({
      orderId,
      userId: session.user.id,
      storeId: order.storeId,
      rating,
      comment,
    })

    // Update store rating
    const reviews = await ReviewSchema.find({ storeId: order.storeId })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    
    await StoreSchema.findByIdAndUpdate(order.storeId, {
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      reviewCount: reviews.length,
    })

    return {
      success: true,
      review,
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create review',
    })
  }
})
