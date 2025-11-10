// Utility function to check and expire orders
export async function expireOrders() {
  try {
    const now = new Date()
    
    // Find orders that have expired
    const expiredOrders = await OrderSchema.find({
      status: { $in: ['pending', 'confirmed', 'ready'] },
      expiresAt: { $lt: now }
    })

    if (expiredOrders.length > 0) {
      console.log(`Found ${expiredOrders.length} expired orders`)
      
      for (const order of expiredOrders) {
        // Restore product quantity
        await ProductSchema.findByIdAndUpdate(order.productId, {
          $inc: { quantity: order.quantity }
        })

        // Update order status to expired
        await OrderSchema.findByIdAndUpdate(order._id, {
          status: 'expired',
          cancellationReason: 'Đơn hàng tự động hủy do hết hạn'
        })
      }

      console.log(`Expired ${expiredOrders.length} orders`)
    }
  } catch (error) {
    console.error('Error expiring orders:', error)
  }
}
