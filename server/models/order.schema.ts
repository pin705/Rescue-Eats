import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema } from 'mongoose'

export const OrderSchema = defineMongooseModel({
  name: 'Order',
  schema: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    voucherCode: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['reserved', 'confirmed', 'completed', 'cancelled', 'expired'],
      default: 'reserved',
    },
    reservedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    completedAt: Date,
    productSnapshot: {
      name: String,
      originalPrice: Number,
      discountedPrice: Number,
      discountPercentage: Number,
      expiryDate: Date,
    },
  },
  hooks(schema) {
    // Generate unique voucher code before saving
    schema.pre('save', function(next) {
      if (!this.voucherCode) {
        this.voucherCode = `RE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }
      // Set expiration to 24 hours from reservation
      if (!this.expiresAt) {
        this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
      next()
    })
  },
})
