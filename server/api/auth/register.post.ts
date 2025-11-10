import { hash } from 'bcrypt'

export default defineEventHandler(async (event) => {
  const { name, email, password, role, storeName, address } = await readBody(event)

  // Validate required fields
  if (!name || !email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Name, email, and password are required',
    })
  }

  // Check if role is valid
  if (role && !['customer', 'store'].includes(role)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid role',
    })
  }

  try {
    // Check if user already exists
    const existingUser = await UserSchema.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'Email already registered',
      })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = await UserSchema.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'customer',
    })

    // If role is store, create store profile
    if (role === 'store') {
      if (!storeName || !address) {
        throw createError({
          statusCode: 400,
          message: 'Store name and address are required for store registration',
        })
      }

      // For MVP, default coordinates to Hanoi, Vietnam
      const defaultCoordinates = [105.8342, 21.0278] // [longitude, latitude]

      await StoreSchema.create({
        userId: user._id,
        storeName,
        address: {
          street: address.street || address,
          city: address.city || 'Hanoi',
          state: address.state || '',
          zipCode: address.zipCode || '',
          country: 'Vietnam',
        },
        location: {
          type: 'Point',
          coordinates: address.coordinates || defaultCoordinates,
        },
        phone: address.phone || '',
        status: 'pending',
      })
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
      },
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Registration failed',
    })
  }
})
