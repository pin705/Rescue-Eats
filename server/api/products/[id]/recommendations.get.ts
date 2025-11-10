export default defineEventHandler(async (event) => {
  const productId = getRouterParam(event, 'id')
  const query = getQuery(event)
  const limit = query.limit ? Number(query.limit) : 4

  if (!productId) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required',
    })
  }

  try {
    // Get the current product
    const product = await ProductSchema.findById(productId).populate('storeId')
    
    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Product not found',
      })
    }

    let recommendations: any[] = []

    // Strategy 1: Same category products from nearby stores
    if (product.storeId?.location) {
      const nearbyStores = await StoreSchema.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: product.storeId.location.coordinates,
            },
            $maxDistance: 5000, // 5km radius
          },
        },
        status: 'approved',
        _id: { $ne: product.storeId._id }, // Exclude current store
      }).limit(10)

      const nearbyStoreIds = nearbyStores.map(s => s._id)

      const sameCategoryProducts = await ProductSchema.find({
        category: product.category,
        storeId: { $in: nearbyStoreIds },
        status: 'active',
        quantity: { $gt: 0 },
        expiryDate: { $gt: new Date() },
        _id: { $ne: productId },
      })
        .populate('storeId', 'storeName address location rating reviewCount')
        .limit(limit)

      recommendations = [...sameCategoryProducts]
    }

    // Strategy 2: If not enough, get same category from any store
    if (recommendations.length < limit) {
      const moreSameCategory = await ProductSchema.find({
        category: product.category,
        status: 'active',
        quantity: { $gt: 0 },
        expiryDate: { $gt: new Date() },
        _id: { $ne: productId, $nin: recommendations.map(r => r._id) },
      })
        .populate('storeId', 'storeName address location rating reviewCount')
        .limit(limit - recommendations.length)

      recommendations = [...recommendations, ...moreSameCategory]
    }

    // Strategy 3: If still not enough, get high discount products
    if (recommendations.length < limit) {
      const highDiscountProducts = await ProductSchema.find({
        status: 'active',
        quantity: { $gt: 0 },
        expiryDate: { $gt: new Date() },
        discountPercentage: { $gte: 50 },
        _id: { $ne: productId, $nin: recommendations.map(r => r._id) },
      })
        .populate('storeId', 'storeName address location rating reviewCount')
        .sort({ discountPercentage: -1 })
        .limit(limit - recommendations.length)

      recommendations = [...recommendations, ...highDiscountProducts]
    }

    return {
      success: true,
      recommendations: recommendations.slice(0, limit),
      count: recommendations.length,
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch recommendations',
    })
  }
})
