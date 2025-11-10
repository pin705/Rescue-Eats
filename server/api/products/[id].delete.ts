export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session?.user || session.user.role !== 'store') {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  const id = getRouterParam(event, 'id')

  try {
    // Get store
    const store = await StoreSchema.findOne({ userId: session.user.id })
    if (!store) {
      throw createError({
        statusCode: 404,
        message: 'Store not found',
      })
    }

    // Find product and verify ownership
    const product = await ProductSchema.findOne({ _id: id, storeId: store._id })
    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Product not found or access denied',
      })
    }

    // Archive instead of delete
    await ProductSchema.findByIdAndUpdate(id, { status: 'archived' })

    return {
      success: true,
      message: 'Product archived successfully',
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to archive product',
    })
  }
})
