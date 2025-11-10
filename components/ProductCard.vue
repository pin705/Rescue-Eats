<template>
  <div class="card hover:shadow-md transition-shadow duration-200 cursor-pointer" @click="$emit('click')">
    <!-- Product Image -->
    <div class="relative aspect-[4/3] bg-gray-100">
      <img
        v-if="product.images && product.images.length > 0"
        :src="product.images[0]"
        :alt="product.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Icon name="lucide:image-off" class="w-12 h-12 text-gray-300" />
      </div>
      
      <!-- Discount Badge -->
      <div class="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
        -{{ product.discountPercentage }}%
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <!-- Product Name -->
      <h3 class="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
        {{ product.name }}
      </h3>

      <!-- Store Info -->
      <div class="flex items-center gap-1 text-sm text-gray-600 mb-3">
        <Icon name="lucide:store" class="w-4 h-4" />
        <span class="truncate">{{ storeName }}</span>
      </div>

      <!-- Pricing -->
      <div class="flex items-end gap-2 mb-3">
        <span class="text-2xl font-bold text-earth-green-800">
          {{ formatPrice(product.discountedPrice) }}
        </span>
        <span class="text-sm text-gray-500 line-through mb-1">
          {{ formatPrice(product.originalPrice) }}
        </span>
      </div>

      <!-- Expiry Info -->
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center gap-1" :class="expiryColorClass">
          <Icon name="lucide:clock" class="w-4 h-4" />
          <span class="font-medium">{{ expiryText }}</span>
        </div>
        <div class="flex items-center gap-1 text-gray-600">
          <Icon name="lucide:package" class="w-4 h-4" />
          <span>{{ product.quantity }} left</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  product: {
    name: string
    images?: string[]
    discountPercentage: number
    discountedPrice: number
    originalPrice: number
    expiryDate: string | Date
    quantity: number
    storeId?: {
      storeName: string
    }
  }
  storeName?: string
}>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const expiryDate = computed(() => new Date(props.product.expiryDate))
const now = new Date()
const hoursUntilExpiry = computed(() => {
  return Math.floor((expiryDate.value.getTime() - now.getTime()) / (1000 * 60 * 60))
})

const expiryText = computed(() => {
  const hours = hoursUntilExpiry.value
  if (hours < 24) {
    return `${hours}h left`
  } else {
    const days = Math.floor(hours / 24)
    return `${days}d left`
  }
})

const expiryColorClass = computed(() => {
  const hours = hoursUntilExpiry.value
  if (hours < 24) return 'text-red-600'
  if (hours < 48) return 'text-orange-600'
  return 'text-earth-green-700'
})

const computedStoreName = computed(() => {
  return props.storeName || props.product.storeId?.storeName || 'Store'
})
</script>
