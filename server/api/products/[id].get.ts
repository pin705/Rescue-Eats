export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required',
    })
  }

  try {
    const product = await ProductSchema.findById(id).populate('storeId', 'storeName address location phone')

    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Product not found',
      })
    }

    return {
      success: true,
      product,
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch product',
    })
  }
})
