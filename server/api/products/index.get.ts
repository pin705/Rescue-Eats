export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { search, category, location, maxDistance, sort, storeId } = query

  try {
    let filter: any = {
      status: 'active',
      quantity: { $gt: 0 },
      expiryDate: { $gt: new Date() }, // Only show products not yet expired
    }

    // Filter by store ID if provided
    if (storeId) {
      filter.storeId = storeId
    }

    // Search by name
    if (search) {
      filter.name = { $regex: search, $options: 'i' }
    }

    // Filter by category
    if (category) {
      filter.category = category
    }

    let products

    // Location-based search (only if no specific store requested)
    if (location && !storeId) {
      const [lng, lat] = location.toString().split(',').map(Number)
      const maxDist = maxDistance ? Number(maxDistance) : 5000 // default 5km

      // Get stores within radius
      const nearbyStores = await StoreSchema.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            $maxDistance: maxDist,
          },
        },
        status: 'approved',
      })

      const storeIds = nearbyStores.map((s) => s._id)
      filter.storeId = { $in: storeIds }
    } else if (!storeId) {
      // Just get products from approved stores (if no specific store requested)
      const approvedStores = await StoreSchema.find({ status: 'approved' })
      const storeIds = approvedStores.map((s) => s._id)
      filter.storeId = { $in: storeIds }
    }

    // Sort options
    let sortOption: any = { createdAt: -1 } // newest first
    if (sort === 'price-asc') {
      sortOption = { discountedPrice: 1 }
    } else if (sort === 'price-desc') {
      sortOption = { discountedPrice: -1 }
    } else if (sort === 'discount') {
      sortOption = { discountPercentage: -1 }
    } else if (sort === 'expiry') {
      sortOption = { expiryDate: 1 } // expiring soonest first
    }

    products = await ProductSchema.find(filter)
      .sort(sortOption)
      .populate('storeId', 'storeName address location rating reviewCount')
      .limit(50)

    // Sort by store rating if requested (requires populated storeId)
    if (sort === 'store-rating') {
      products = products.sort((a: any, b: any) => {
        const ratingA = a.storeId?.rating || 0
        const ratingB = b.storeId?.rating || 0
        return ratingB - ratingA
      })
    }

    return {
      success: true,
      products,
      count: products.length,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch products',
    })
  }
})
