<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center gap-4">
          <button @click="navigateTo('/')" class="text-gray-600 hover:text-earth-green-800">
            <Icon name="lucide:arrow-left" class="w-6 h-6" />
          </button>
          <h1 class="text-xl font-semibold text-gray-900">Product Details</h1>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 py-12 text-center">
      <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-earth-green-800 mx-auto" />
      <p class="text-gray-600 mt-2">Loading product...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 py-12 text-center">
      <Icon name="lucide:alert-circle" class="w-12 h-12 text-red-600 mx-auto" />
      <p class="text-red-600 mt-2">{{ error }}</p>
      <button @click="navigateTo('/')" class="btn-primary mt-4">
        Back to Home
      </button>
    </div>

    <!-- Product Details -->
    <div v-else-if="product" class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Product Image -->
        <div class="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
          <img
            v-if="product.images && product.images.length > 0"
            :src="product.images[0]"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <Icon name="lucide:image-off" class="w-24 h-24 text-gray-300" />
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <!-- Discount Badge -->
          <div class="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-lg font-bold">
            -{{ product.discountPercentage }}% OFF
          </div>

          <!-- Product Name -->
          <div>
            <h2 class="text-3xl font-bold text-gray-900">{{ product.name }}</h2>
            <p v-if="product.description" class="text-gray-600 mt-2">{{ product.description }}</p>
          </div>

          <!-- Pricing -->
          <div class="space-y-2">
            <div class="flex items-end gap-3">
              <span class="text-4xl font-bold text-earth-green-800">
                {{ formatPrice(product.discountedPrice) }}
              </span>
              <span class="text-xl text-gray-500 line-through mb-1">
                {{ formatPrice(product.originalPrice) }}
              </span>
            </div>
            <p class="text-sm text-gray-600">
              You save {{ formatPrice(product.originalPrice - product.discountedPrice) }}
            </p>
          </div>

          <!-- Expiry Info -->
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div class="flex items-center gap-2 text-orange-700">
              <Icon name="lucide:clock" class="w-5 h-5" />
              <span class="font-medium">Expires: {{ formatDate(product.expiryDate) }}</span>
              <span class="text-sm">({{ timeUntilExpiry }})</span>
            </div>
          </div>

          <!-- Quantity Available -->
          <div class="flex items-center gap-2 text-gray-700">
            <Icon name="lucide:package" class="w-5 h-5" />
            <span class="font-medium">{{ product.quantity }} items available</span>
          </div>

          <!-- Quantity Selector -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Quantity</label>
            <div class="flex items-center gap-4">
              <button
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
                class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="lucide:minus" class="w-5 h-5" />
              </button>
              <span class="text-2xl font-semibold w-12 text-center">{{ quantity }}</span>
              <button
                @click="increaseQuantity"
                :disabled="quantity >= product.quantity"
                class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="lucide:plus" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Reserve Button -->
          <button
            @click="handleReserve"
            :disabled="reserving || product.quantity === 0"
            class="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="reserving" class="flex items-center justify-center gap-2">
              <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
              Reserving...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <Icon name="lucide:ticket" class="w-5 h-5" />
              Reserve & Get Voucher
            </span>
          </button>

          <!-- Store Info -->
          <div class="border-t pt-6 space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Store Information</h3>
            
            <div class="space-y-3">
              <div class="flex items-start gap-2">
                <Icon name="lucide:store" class="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p class="font-medium text-gray-900">{{ product.storeId?.storeName }}</p>
                </div>
              </div>

              <div class="flex items-start gap-2">
                <Icon name="lucide:map-pin" class="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p class="text-gray-700">{{ formatAddress(product.storeId?.address) }}</p>
                </div>
              </div>

              <div v-if="product.storeId?.phone" class="flex items-start gap-2">
                <Icon name="lucide:phone" class="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p class="text-gray-700">{{ product.storeId.phone }}</p>
                </div>
              </div>
            </div>

            <!-- Mini Map Placeholder -->
            <div class="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <div class="text-center text-gray-500">
                <Icon name="lucide:map" class="w-12 h-12 mx-auto mb-2" />
                <p class="text-sm">Map integration coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const productId = route.params.id

const product = ref<any>(null)
const loading = ref(true)
const error = ref('')
const reserving = ref(false)
const quantity = ref(1)

onMounted(async () => {
  await loadProduct()
})

const loadProduct = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data } = await useFetch(`/api/products/${productId}`)
    if (data.value?.product) {
      product.value = data.value.product
    } else {
      error.value = 'Product not found'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load product'
  } finally {
    loading.value = false
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const timeUntilExpiry = computed(() => {
  if (!product.value) return ''
  const now = new Date()
  const expiry = new Date(product.value.expiryDate)
  const hours = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60))
  
  if (hours < 24) return `${hours} hours left`
  const days = Math.floor(hours / 24)
  return `${days} days left`
})

const formatAddress = (address: any) => {
  if (!address) return 'Address not available'
  if (typeof address === 'string') return address
  const parts = [address.street, address.city, address.state].filter(Boolean)
  return parts.join(', ') || 'Address not available'
}

const increaseQuantity = () => {
  if (quantity.value < product.value.quantity) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const handleReserve = async () => {
  // Check if user is logged in
  const { data: session } = await useFetch('/api/auth/session')
  if (!session.value?.user) {
    alert('Please login to reserve products')
    navigateTo('/auth/login')
    return
  }

  reserving.value = true

  try {
    const response = await $fetch('/api/orders', {
      method: 'POST',
      body: {
        productId: productId,
        quantity: quantity.value,
      },
    })

    if (response.success) {
      alert('Product reserved successfully! Check your orders to see the voucher code.')
      navigateTo('/orders')
    }
  } catch (err: any) {
    alert(err.data?.message || 'Failed to reserve product')
  } finally {
    reserving.value = false
  }
}
</script>
