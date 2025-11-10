import { expireOrders } from '~/server/utils/orderExpiry'

export default defineEventHandler(async (event) => {
  // Simple security: check for a secret token (you should set this in environment variables)
  const authHeader = getHeader(event, 'authorization')
  const expectedToken = process.env.CRON_SECRET || 'default-secret-change-me'
  
  if (authHeader !== `Bearer ${expectedToken}`) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  try {
    await expireOrders()
    
    return {
      success: true,
      message: 'Order expiry check completed',
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to expire orders',
    })
  }
})
