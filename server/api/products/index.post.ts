export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session?.user || session.user.role !== 'store') {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized. Store account required.',
    })
  }

  const body = await readBody(event)
  const { name, description, category, images, expiryDate, quantity, originalPrice, discountedPrice } = body

  // Validate required fields
  if (!name || !expiryDate || !quantity || !originalPrice || !discountedPrice) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields',
    })
  }

  try {
    // Get store associated with this user
    const store = await StoreSchema.findOne({ userId: session.user.id })
    if (!store) {
      throw createError({
        statusCode: 404,
        message: 'Store not found',
      })
    }

    if (store.status !== 'approved') {
      throw createError({
        statusCode: 403,
        message: 'Store must be approved to add products',
      })
    }

    // Create product
    const product = await ProductSchema.create({
      storeId: store._id,
      name,
      description,
      category,
      images: images || [],
      expiryDate: new Date(expiryDate),
      quantity: Number(quantity),
      originalPrice: Number(originalPrice),
      discountedPrice: Number(discountedPrice),
      status: 'active',
    })

    return {
      success: true,
      product,
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create product',
    })
  }
})
