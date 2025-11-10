export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { storeId } = query

  if (!storeId) {
    throw createError({
      statusCode: 400,
      message: 'Store ID is required',
    })
  }

  try {
    const reviews = await ReviewSchema.find({ storeId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(50)

    return {
      success: true,
      reviews,
      count: reviews.length,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch reviews',
    })
  }
})
