<template>
  <div class="card">
    <div class="p-4 space-y-4">
      <!-- Order Status Badge -->
      <div class="flex items-center justify-between">
        <span :class="statusClass" class="px-3 py-1 rounded-full text-sm font-medium">
          {{ statusText }}
        </span>
        <span class="text-sm text-gray-500">
          {{ formatDate(order.reservedAt) }}
        </span>
      </div>

      <!-- Product Info -->
      <div class="flex gap-3">
        <div class="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
          <img
            v-if="order.productId?.images?.[0]"
            :src="order.productId.images[0]"
            :alt="order.productSnapshot?.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <Icon name="lucide:image-off" class="w-8 h-8 text-gray-300" />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 truncate">
            {{ order.productSnapshot?.name || 'Product' }}
          </h3>
          <div class="flex items-center gap-1 text-sm text-gray-600 mt-1">
            <Icon name="lucide:store" class="w-4 h-4" />
            <span class="truncate">{{ order.storeId?.storeName || 'Store' }}</span>
          </div>
          <div class="text-sm text-gray-600 mt-1">
            Quantity: {{ order.quantity }}
          </div>
        </div>
      </div>

      <!-- Voucher Code -->
      <div class="bg-earth-green-50 border-2 border-dashed border-earth-green-600 rounded-lg p-4">
        <div class="text-center space-y-2">
          <div class="text-xs text-gray-600 uppercase font-medium">Voucher Code</div>
          <div class="font-mono text-2xl font-bold text-earth-green-800 tracking-wider">
            {{ order.voucherCode }}
          </div>
          <div class="text-xs text-gray-500">
            Show this code at the store
          </div>
        </div>
      </div>

      <!-- Pricing -->
      <div class="flex items-center justify-between pt-2 border-t border-gray-100">
        <span class="text-gray-600">Total Amount</span>
        <span class="text-xl font-bold text-earth-green-800">
          {{ formatPrice(order.totalPrice) }}
        </span>
      </div>

      <!-- Expiry Warning -->
      <div v-if="!isExpired && order.status === 'reserved'" class="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
        <Icon name="lucide:clock" class="w-4 h-4" />
        <span>Valid until {{ formatDate(order.expiresAt) }}</span>
      </div>

      <!-- Store Address -->
      <div class="text-sm text-gray-600 flex items-start gap-2">
        <Icon name="lucide:map-pin" class="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>{{ formatAddress(order.storeId?.address) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  order: {
    voucherCode: string
    totalPrice: number
    quantity: number
    status: string
    reservedAt: string | Date
    expiresAt: string | Date
    productSnapshot?: {
      name: string
      discountedPrice: number
    }
    productId?: {
      images?: string[]
    }
    storeId?: {
      storeName: string
      address?: any
    }
  }
}>()

const isExpired = computed(() => {
  return new Date(props.order.expiresAt) < new Date()
})

const statusText = computed(() => {
  if (isExpired.value && props.order.status === 'reserved') {
    return 'Expired'
  }
  return props.order.status.charAt(0).toUpperCase() + props.order.status.slice(1)
})

const statusClass = computed(() => {
  const status = props.order.status
  if (isExpired.value && status === 'reserved') {
    return 'bg-gray-100 text-gray-600'
  }
  switch (status) {
    case 'reserved':
      return 'bg-blue-100 text-blue-700'
    case 'confirmed':
      return 'bg-green-100 text-green-700'
    case 'completed':
      return 'bg-earth-green-100 text-earth-green-700'
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatAddress = (address: any) => {
  if (!address) return 'Address not available'
  if (typeof address === 'string') return address
  const parts = [address.street, address.city, address.state].filter(Boolean)
  return parts.join(', ') || 'Address not available'
}
</script>
