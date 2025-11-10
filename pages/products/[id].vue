<template>
  <div class="min-h-screen bg-gray-50">
    <!-- SEO -->
    <Head v-if="product">
      <Title>{{ product.name }} - Giảm {{ product.discountPercentage }}% | Rescue Eats</Title>
      <Meta name="description" :content="`${product.name} - Giảm giá ${product.discountPercentage}% chỉ còn ${formatPrice(product.discountedPrice)} từ ${product.storeId?.storeName}. ${product.description || 'Đặt ngay để không bỏ lỡ deal!'}`" />
      <Meta property="og:title" :content="`${product.name} - Giảm ${product.discountPercentage}%`" />
      <Meta property="og:description" :content="product.description || `Deal thực phẩm từ ${product.storeId?.storeName}`" />
      <Meta property="og:type" content="product" />
      <Meta v-if="product.images && product.images.length > 0" property="og:image" :content="product.images[0]" />
      <Meta name="product:price:amount" :content="product.discountedPrice.toString()" />
      <Meta name="product:price:currency" content="VND" />
    </Head>

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center gap-4">
          <button @click="navigateTo('/')" class="text-gray-600 hover:text-earth-green-800">
            <Icon name="lucide:arrow-left" class="w-6 h-6" />
          </button>
          <h1 class="text-xl font-semibold text-gray-900">Chi tiết sản phẩm</h1>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 py-12 text-center">
      <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-earth-green-800 mx-auto" />
      <p class="text-gray-600 mt-2">Đang tải sản phẩm...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 py-12 text-center">
      <Icon name="lucide:alert-circle" class="w-12 h-12 text-red-600 mx-auto" />
      <p class="text-red-600 mt-2">{{ error }}</p>
      <button @click="navigateTo('/')" class="btn-primary mt-4">
        Về trang chủ
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
              Bạn tiết kiệm {{ formatPrice(product.originalPrice - product.discountedPrice) }}
            </p>
          </div>

          <!-- Expiry Info -->
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div class="flex items-center gap-2 text-orange-700">
              <Icon name="lucide:clock" class="w-5 h-5" />
              <span class="font-medium">Hết hạn: {{ formatDate(product.expiryDate) }}</span>
              <span class="text-sm">({{ timeUntilExpiry }})</span>
            </div>
          </div>

          <!-- Quantity Available -->
          <div class="flex items-center gap-2 text-gray-700">
            <Icon name="lucide:package" class="w-5 h-5" />
            <span class="font-medium">Còn {{ product.quantity }} sản phẩm</span>
          </div>

          <!-- Quantity Selector -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Số lượng</label>
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
              Đang đặt hàng...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <Icon name="lucide:ticket" class="w-5 h-5" />
              Đặt hàng & Nhận Voucher
            </span>
          </button>

          <!-- Store Info -->
          <div class="border-t pt-6 space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Thông tin cửa hàng</h3>
            
            <div class="space-y-3">
              <div class="flex items-start gap-2">
                <Icon name="lucide:store" class="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p class="font-medium text-gray-900">{{ product.storeId?.storeName }}</p>
                  <div v-if="product.storeId?.rating > 0" class="flex items-center gap-1 mt-1">
                    <Icon name="lucide:star" class="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span class="text-sm text-gray-600">{{ product.storeId.rating }} ({{ product.storeId.reviewCount }} đánh giá)</span>
                  </div>
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
                <p class="text-sm">Bản đồ sẽ được tích hợp sớm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations Section -->
      <section v-if="recommendations.length > 0" class="max-w-7xl mx-auto px-4 py-12">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">Bạn có thể thích</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="rec in recommendations"
            :key="rec._id"
            :product="rec"
            :store-name="rec.storeId?.storeName"
            @click="navigateToProduct(rec._id)"
          />
        </div>
      </section>
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
const recommendations = ref<any[]>([])

onMounted(async () => {
  await loadProduct()
  await loadRecommendations()
})

const loadProduct = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data } = await useFetch(`/api/products/${productId}`)
    if (data.value?.product) {
      product.value = data.value.product
    } else {
      error.value = 'Không tìm thấy sản phẩm'
    }
  } catch (err: any) {
    error.value = err.message || 'Không thể tải sản phẩm'
  } finally {
    loading.value = false
  }
}

const loadRecommendations = async () => {
  try {
    const { data } = await useFetch(`/api/products/${productId}/recommendations`)
    if (data.value?.recommendations) {
      recommendations.value = data.value.recommendations
    }
  } catch (err) {
    console.error('Failed to load recommendations:', err)
  }
}

const navigateToProduct = (id: string) => {
  navigateTo(`/products/${id}`)
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
  
  if (hours < 24) return `còn ${hours} giờ`
  const days = Math.floor(hours / 24)
  return `còn ${days} ngày`
})

const formatAddress = (address: any) => {
  if (!address) return 'Chưa có địa chỉ'
  if (typeof address === 'string') return address
  const parts = [address.street, address.city, address.state].filter(Boolean)
  return parts.join(', ') || 'Chưa có địa chỉ'
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
    alert('Vui lòng đăng nhập để đặt hàng')
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
      alert('Đặt hàng thành công! Kiểm tra đơn hàng của bạn để xem mã voucher.')
      navigateTo('/orders')
    }
  } catch (err: any) {
    alert(err.data?.message || 'Không thể đặt hàng')
  } finally {
    reserving.value = false
  }
}
</script>
