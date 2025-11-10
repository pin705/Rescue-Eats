<template>
  <div class="min-h-screen bg-gray-50">
    <!-- SEO -->
    <Head v-if="store">
      <Title>{{ store.storeName }} - Cửa hàng | Rescue Eats</Title>
      <Meta name="description" :content="`Xem sản phẩm từ ${store.storeName}. ${store.rating > 0 ? `Đánh giá ${store.rating}/5 từ ${store.reviewCount} khách hàng.` : ''}`" />
      <Meta property="og:title" :content="`${store.storeName} - Rescue Eats`" />
      <Meta property="og:type" content="business.business" />
    </Head>

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center gap-4">
          <button @click="navigateTo('/')" class="text-gray-600 hover:text-earth-green-800">
            <Icon name="lucide:arrow-left" class="w-6 h-6" />
          </button>
          <h1 class="text-xl font-semibold text-gray-900">Thông tin cửa hàng</h1>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 py-12 text-center">
      <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-earth-green-800 mx-auto" />
      <p class="text-gray-600 mt-2">Đang tải...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 py-12 text-center">
      <Icon name="lucide:alert-circle" class="w-12 h-12 text-red-600 mx-auto" />
      <p class="text-red-600 mt-2">{{ error }}</p>
      <button @click="navigateTo('/')" class="btn-primary mt-4">
        Về trang chủ
      </button>
    </div>

    <!-- Store Details -->
    <div v-else-if="store" class="max-w-7xl mx-auto px-4 py-8">
      <!-- Store Header -->
      <div class="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h2 class="text-3xl font-bold text-gray-900">{{ store.storeName }}</h2>
            
            <!-- Rating -->
            <div v-if="store.rating > 0" class="flex items-center gap-2 mt-2">
              <div class="flex items-center gap-1">
                <Icon name="lucide:star" class="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span class="text-lg font-semibold text-gray-900">{{ store.rating }}</span>
              </div>
              <span class="text-gray-600">({{ store.reviewCount }} đánh giá)</span>
            </div>

            <!-- Address -->
            <div class="flex items-start gap-2 mt-4">
              <Icon name="lucide:map-pin" class="w-5 h-5 text-gray-600 mt-0.5" />
              <p class="text-gray-700">{{ formatAddress(store.address) }}</p>
            </div>

            <!-- Phone -->
            <div v-if="store.phone" class="flex items-center gap-2 mt-2">
              <Icon name="lucide:phone" class="w-5 h-5 text-gray-600" />
              <p class="text-gray-700">{{ store.phone }}</p>
            </div>
          </div>

          <!-- Follow Button -->
          <button
            v-if="user"
            @click="toggleFollow"
            :disabled="followLoading"
            class="px-6 py-3 rounded-lg font-medium transition-colors"
            :class="isFollowing 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-earth-green-800 text-white hover:bg-earth-green-900'"
          >
            <span v-if="followLoading" class="flex items-center gap-2">
              <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
            </span>
            <span v-else class="flex items-center gap-2">
              <Icon :name="isFollowing ? 'lucide:heart-off' : 'lucide:heart'" class="w-5 h-5" />
              {{ isFollowing ? 'Bỏ theo dõi' : 'Theo dõi' }}
            </span>
          </button>
        </div>
      </div>

      <!-- Store Products -->
      <div class="bg-white rounded-2xl shadow-md p-6">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">Sản phẩm từ cửa hàng này</h3>
        
        <div v-if="productsLoading" class="text-center py-12">
          <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-earth-green-800 mx-auto" />
          <p class="text-gray-600 mt-2">Đang tải sản phẩm...</p>
        </div>

        <div v-else-if="products.length === 0" class="text-center py-12">
          <Icon name="lucide:package-x" class="w-16 h-16 text-gray-300 mx-auto" />
          <p class="text-gray-600 mt-4">Chưa có sản phẩm nào</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            v-for="product in products"
            :key="product._id"
            :product="product"
            :store-name="store.storeName"
            @click="navigateTo(`/products/${product._id}`)"
          />
        </div>
      </div>

      <!-- Reviews Section -->
      <div v-if="reviews.length > 0" class="bg-white rounded-2xl shadow-md p-6 mt-6">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">Đánh giá từ khách hàng</h3>
        
        <div class="space-y-4">
          <div v-for="review in reviews" :key="review._id" class="border-b border-gray-200 pb-4 last:border-0">
            <div class="flex items-center gap-2 mb-2">
              <div class="flex items-center">
                <Icon v-for="i in 5" :key="i" 
                  name="lucide:star" 
                  class="w-4 h-4"
                  :class="i <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'"
                />
              </div>
              <span class="text-sm text-gray-600">{{ review.userId?.name }}</span>
            </div>
            <p v-if="review.comment" class="text-gray-700">{{ review.comment }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ formatDate(review.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const storeId = route.params.id

const store = ref<any>(null)
const products = ref<any[]>([])
const reviews = ref<any[]>([])
const user = ref<any>(null)
const isFollowing = ref(false)
const loading = ref(true)
const productsLoading = ref(true)
const followLoading = ref(false)
const error = ref('')

onMounted(async () => {
  await checkAuth()
  await loadStore()
  await loadProducts()
  await loadReviews()
})

const checkAuth = async () => {
  try {
    const { data } = await useFetch('/api/auth/session')
    if (data.value?.user) {
      user.value = data.value.user
    }
  } catch (err) {
    console.error('Auth check failed:', err)
  }
}

const loadStore = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data } = await useFetch(`/api/stores/${storeId}`)
    if (data.value?.store) {
      store.value = data.value.store
      isFollowing.value = data.value.isFollowing || false
    } else {
      error.value = 'Không tìm thấy cửa hàng'
    }
  } catch (err: any) {
    error.value = err.message || 'Không thể tải cửa hàng'
  } finally {
    loading.value = false
  }
}

const loadProducts = async () => {
  productsLoading.value = true

  try {
    const { data } = await useFetch('/api/products', {
      params: { storeId }
    })
    if (data.value?.products) {
      products.value = data.value.products
    }
  } catch (err) {
    console.error('Failed to load products:', err)
  } finally {
    productsLoading.value = false
  }
}

const loadReviews = async () => {
  try {
    const { data } = await useFetch('/api/reviews', {
      params: { storeId }
    })
    if (data.value?.reviews) {
      reviews.value = data.value.reviews
    }
  } catch (err) {
    console.error('Failed to load reviews:', err)
  }
}

const toggleFollow = async () => {
  if (!user.value) {
    alert('Vui lòng đăng nhập để theo dõi cửa hàng')
    navigateTo('/auth/login')
    return
  }

  followLoading.value = true

  try {
    const response = await $fetch('/api/stores/follow', {
      method: 'POST',
      body: { storeId }
    })

    if (response.success) {
      isFollowing.value = response.following
    }
  } catch (err: any) {
    alert(err.data?.message || 'Không thể thực hiện')
  } finally {
    followLoading.value = false
  }
}

const formatAddress = (address: any) => {
  if (!address) return 'Chưa có địa chỉ'
  if (typeof address === 'string') return address
  const parts = [address.street, address.city, address.state].filter(Boolean)
  return parts.join(', ') || 'Chưa có địa chỉ'
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
