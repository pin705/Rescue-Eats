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
    depositAmount: {
      type: Number,
      default: 0,
    },
    depositPaid: {
      type: Boolean,
      default: false,
    },
    voucherCode: {
      type: String,
      required: true,
      unique: true,
    },
    qrCode: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'ready', 'completed', 'cancelled', 'expired'],
      default: 'pending',
    },
    cancellationReason: String,
    reservedAt: {
      type: Date,
      default: Date.now,
    },
    reservationExpiryTime: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    confirmedAt: Date,
    readyAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    productSnapshot: {
      name: String,
      originalPrice: Number,
      discountedPrice: Number,
      discountPercentage: Number,
      expiryDate: Date,
    },
  },
  hooks(schema) {
    // Generate unique voucher code and QR code before saving
    schema.pre('save', function(next) {
      if (!this.voucherCode) {
        this.voucherCode = `RE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }
      // Generate QR code data (just the voucher code for now)
      if (!this.qrCode) {
        this.qrCode = this.voucherCode
      }
      // Set expiration to 24 hours from reservation
      if (!this.expiresAt) {
        this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
      // Set reservation expiry time (e.g., 2 hours for store to confirm)
      if (!this.reservationExpiryTime) {
        this.reservationExpiryTime = new Date(Date.now() + 2 * 60 * 60 * 1000)
      }
      next()
    })
  },
})
