export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const query = getQuery(event)
  const { storeOnly } = query
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  try {
    let orders

    if (storeOnly && session.user.role === 'store') {
      // Get store for this user
      const store = await StoreSchema.findOne({ userId: session.user.id })
      if (!store) {
        throw createError({
          statusCode: 404,
          message: 'Store not found',
        })
      }

      // Get orders for this store
      orders = await OrderSchema.find({ storeId: store._id })
        .populate('productId', 'name images')
        .populate('userId', 'name email')
        .sort({ reservedAt: -1 })
    } else {
      // Get orders for this customer
      orders = await OrderSchema.find({ userId: session.user.id })
        .populate('productId', 'name images')
        .populate('storeId', 'storeName address')
        .sort({ reservedAt: -1 })
    }

    return {
      success: true,
      orders,
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch orders',
    })
  }
})
