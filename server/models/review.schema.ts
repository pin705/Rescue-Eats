import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema } from 'mongoose'

export const ReviewSchema = defineMongooseModel({
  name: 'Review',
  schema: {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  options: {
    indexes: [
      { orderId: 1 },
      { storeId: 1 },
      { userId: 1 },
    ],
  },
})
