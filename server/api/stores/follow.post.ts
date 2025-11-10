export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized. Please login.',
    })
  }

  const { storeId } = await readBody(event)

  if (!storeId) {
    throw createError({
      statusCode: 400,
      message: 'Store ID is required',
    })
  }

  try {
    // Check if store exists
    const store = await StoreSchema.findById(storeId)
    if (!store) {
      throw createError({
        statusCode: 404,
        message: 'Store not found',
      })
    }

    // Get user and check if already following
    const user = await UserSchema.findById(session.user.id)
    const isFollowing = user.followedStores?.includes(storeId)

    if (isFollowing) {
      // Unfollow
      await UserSchema.findByIdAndUpdate(session.user.id, {
        $pull: { followedStores: storeId },
      })
      return {
        success: true,
        following: false,
        message: 'Store unfollowed',
      }
    } else {
      // Follow
      await UserSchema.findByIdAndUpdate(session.user.id, {
        $addToSet: { followedStores: storeId },
      })
      return {
        success: true,
        following: true,
        message: 'Store followed',
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to toggle follow status',
    })
  }
})
