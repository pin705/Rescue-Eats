<template>
  <div class="min-h-screen bg-gray-50">
    <!-- SEO -->
    <Head>
      <Title>Rescue Eats - Cứu Vãn Thực Phẩm, Tiết Kiệm Chi Phí</Title>
      <Meta name="description" content="Khám phá deals thực phẩm gần hết hạn với giá ưu đãi từ các cửa hàng xung quanh bạn. Giảm lãng phí thực phẩm, tiết kiệm chi phí, bảo vệ môi trường." />
      <Meta name="keywords" content="thực phẩm giảm giá, thực phẩm gần hết hạn, giảm lãng phí thực phẩm, tiết kiệm chi phí, rescue eats, cứu vãn thực phẩm" />
      <Meta property="og:title" content="Rescue Eats - Cứu Vãn Thực Phẩm, Tiết Kiệm Chi Phí" />
      <Meta property="og:description" content="Khám phá deals thực phẩm gần hết hạn với giá ưu đãi từ các cửa hàng xung quanh bạn" />
      <Meta property="og:type" content="website" />
      <Meta name="twitter:card" content="summary_large_image" />
    </Head>

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="lucide:leaf" class="w-8 h-8 text-earth-green-800" />
            <h1 class="text-2xl font-bold text-earth-green-800">Rescue Eats</h1>
          </div>
          <nav class="flex items-center gap-4">
            <NuxtLink v-if="!user" to="/auth/login" class="text-gray-700 hover:text-earth-green-800">
              Đăng nhập
            </NuxtLink>
            <NuxtLink v-if="!user" to="/auth/register" class="btn-primary">
              Đăng ký
            </NuxtLink>
            <div v-else class="flex items-center gap-3">
              <NuxtLink to="/orders" class="flex items-center gap-1 text-gray-700 hover:text-earth-green-800">
                <Icon name="lucide:receipt" class="w-5 h-5" />
                <span class="hidden sm:inline">Đơn hàng</span>
              </NuxtLink>
              <NuxtLink v-if="user.role === 'store'" to="/store/dashboard" class="flex items-center gap-1 text-gray-700 hover:text-earth-green-800">
                <Icon name="lucide:store" class="w-5 h-5" />
                <span class="hidden sm:inline">Quản lý</span>
              </NuxtLink>
              <button @click="handleLogout" class="text-gray-700 hover:text-earth-green-800">
                <Icon name="lucide:log-out" class="w-5 h-5" />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-earth-green-800 to-earth-green-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto space-y-4">
          <h2 class="text-3xl md:text-5xl font-bold">Cứu Vãn Thực Phẩm, Tiết Kiệm Chi Phí, Bảo Vệ Hành Tinh</h2>
          <p class="text-lg md:text-xl text-earth-green-100">
            Khám phá các deals thực phẩm gần hết hạn từ các cửa hàng xung quanh bạn
          </p>
        </div>
      </div>
    </section>

    <!-- Search Section -->
    <section class="max-w-7xl mx-auto px-4 -mt-8">
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <SearchBar 
          @search="handleSearch"
          @filter="handleFilter"
          @location="handleLocation"
        />
      </div>
    </section>

    <!-- Products Section -->
    <section class="max-w-7xl mx-auto px-4 py-8">
      <div v-if="loading" class="text-center py-12">
        <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-earth-green-800 mx-auto" />
        <p class="text-gray-600 mt-2">Đang tải sản phẩm...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <Icon name="lucide:alert-circle" class="w-12 h-12 text-red-600 mx-auto" />
        <p class="text-red-600 mt-2">{{ error }}</p>
      </div>

      <div v-else-if="products.length === 0" class="text-center py-12">
        <Icon name="lucide:package-x" class="w-16 h-16 text-gray-300 mx-auto" />
        <p class="text-gray-600 mt-4 text-lg">Không tìm thấy sản phẩm</p>
        <p class="text-gray-500 text-sm mt-2">Thử điều chỉnh tìm kiếm hoặc bộ lọc</p>
      </div>

      <div v-else>
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ products.length }} Deal Đang Có
          </h3>
          <select 
            v-model="sortBy" 
            @change="loadProducts"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-earth-green-600 focus:border-transparent"
          >
            <option value="">Sắp xếp: Mới nhất</option>
            <option value="discount">Giảm giá cao nhất</option>
            <option value="expiry">HSD gần nhất</option>
            <option value="store-rating">Đánh giá cửa hàng cao nhất</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in products"
            :key="product._id"
            :product="product"
            :store-name="product.storeId?.storeName"
            @click="navigateToProduct(product._id)"
          />
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center space-y-4">
          <div class="flex items-center justify-center gap-2">
            <Icon name="lucide:leaf" class="w-6 h-6 text-earth-green-600" />
            <span class="text-xl font-bold">Rescue Eats</span>
          </div>
          <p class="text-gray-400">Cùng nhau giảm lãng phí thực phẩm</p>
          <div class="flex items-center justify-center gap-6 text-sm text-gray-400">
            <a href="#" class="hover:text-white">Về chúng tôi</a>
            <a href="#" class="hover:text-white">Dành cho Cửa hàng</a>
            <a href="#" class="hover:text-white">Liên hệ</a>
          </div>
          <p class="text-sm text-gray-500">© 2024 Rescue Eats. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const user = ref(null)
const products = ref([])
const loading = ref(true)
const error = ref('')
const sortBy = ref('')
const searchQuery = ref('')
const categoryFilter = ref('')
const location = ref<{ lat: number; lng: number } | null>(null)

onMounted(async () => {
  await checkAuth()
  await loadProducts()
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

const loadProducts = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const params: any = {}
    if (searchQuery.value) params.search = searchQuery.value
    if (categoryFilter.value && !categoryFilter.value.startsWith('discount-')) {
      params.category = categoryFilter.value
    }
    if (sortBy.value) params.sort = sortBy.value
    if (location.value) {
      params.location = `${location.value.lng},${location.value.lat}`
      params.maxDistance = 10000 // 10km
    }

    const { data } = await useFetch('/api/products', { params })
    if (data.value?.products) {
      let filtered = data.value.products

      // Apply discount filter if selected
      if (categoryFilter.value === 'discount-50') {
        filtered = filtered.filter((p: any) => p.discountPercentage >= 50)
      } else if (categoryFilter.value === 'discount-70') {
        filtered = filtered.filter((p: any) => p.discountPercentage >= 70)
      }

      products.value = filtered
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load products'
  } finally {
    loading.value = false
  }
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  loadProducts()
}

const handleFilter = (filter: string | null) => {
  categoryFilter.value = filter || ''
  loadProducts()
}

const handleLocation = (loc: { lat: number; lng: number }) => {
  location.value = loc
  loadProducts()
}

const navigateToProduct = (id: string) => {
  navigateTo(`/products/${id}`)
}

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    navigateTo('/auth/login')
  } catch (err) {
    console.error('Logout failed:', err)
  }
}
</script>
