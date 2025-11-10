export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  try {
    const orders = await OrderSchema.find({ userId: session.user.id })
      .populate('productId', 'name images')
      .populate('storeId', 'storeName address')
      .sort({ reservedAt: -1 })

    return {
      success: true,
      orders,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch orders',
    })
  }
})
