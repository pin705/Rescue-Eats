import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema } from 'mongoose'

export const ProductSchema = defineMongooseModel({
  name: 'Product',
  schema: {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    category: {
      type: String,
      enum: ['meat', 'vegetables', 'dairy', 'bakery', 'fruits', 'prepared-food', 'other'],
      default: 'other',
    },
    images: [String],
    expiryDate: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'sold-out'],
      default: 'active',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  hooks(schema) {
    // Auto-calculate discount percentage before saving
    schema.pre('save', function(next) {
      if (this.originalPrice && this.discountedPrice) {
        this.discountPercentage = Math.round(
          ((this.originalPrice - this.discountedPrice) / this.originalPrice) * 100
        )
      }
      this.updatedAt = new Date()
      next()
    })
  },
})
