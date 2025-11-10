import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema } from 'mongoose'

export const UserSchema = defineMongooseModel({
  name: 'User',
  schema: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['customer', 'store', 'admin'],
      default: 'customer',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
})
