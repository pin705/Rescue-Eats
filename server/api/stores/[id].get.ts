export default defineEventHandler(async (event) => {
  const storeId = getRouterParam(event, 'id')

  if (!storeId) {
    throw createError({
      statusCode: 400,
      message: 'Store ID is required',
    })
  }

  try {
    const store = await StoreSchema.findById(storeId)
    
    if (!store) {
      throw createError({
        statusCode: 404,
        message: 'Store not found',
      })
    }

    // Check if user is following (if logged in)
    const session = await getUserSession(event)
    let isFollowing = false
    
    if (session?.user) {
      const user = await UserSchema.findById(session.user.id)
      isFollowing = user?.followedStores?.includes(storeId) || false
    }

    return {
      success: true,
      store,
      isFollowing,
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch store',
    })
  }
})
