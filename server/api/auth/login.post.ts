import { compare } from 'bcrypt'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required',
    })
  }

  try {
    // Find user
    const user = await UserSchema.findOne({ email: email.toLowerCase() })
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials',
      })
    }

    // Verify password
    const isValidPassword = await compare(password, user.password)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials',
      })
    }

    // For store users, check if store is approved
    let storeStatus = null
    if (user.role === 'store') {
      const store = await StoreSchema.findOne({ userId: user._id })
      if (store) {
        storeStatus = store.status
        if (store.status === 'pending') {
          return {
            success: false,
            message: 'Your store account is pending approval. Please wait for admin approval.',
            status: 'pending',
          }
        } else if (store.status === 'rejected' || store.status === 'suspended') {
          throw createError({
            statusCode: 403,
            message: `Your store account has been ${store.status}. Please contact support.`,
          })
        }
      }
    }

    // Create session
    await setUserSession(event, {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    return {
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        storeStatus,
      },
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Login failed',
    })
  }
})
