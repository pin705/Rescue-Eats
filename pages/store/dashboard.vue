<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button @click="navigateTo('/')" class="text-gray-600 hover:text-earth-green-800">
              <Icon name="lucide:arrow-left" class="w-6 h-6" />
            </button>
            <h1 class="text-xl font-semibold text-gray-900">Store Dashboard</h1>
          </div>
          <button @click="handleLogout" class="text-gray-600 hover:text-red-600">
            <Icon name="lucide:log-out" class="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 py-12 text-center">
      <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-earth-green-800 mx-auto" />
      <p class="text-gray-600 mt-2">Loading dashboard...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 py-12 text-center">
      <Icon name="lucide:alert-circle" class="w-12 h-12 text-red-600 mx-auto" />
      <p class="text-red-600 mt-2">{{ error }}</p>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="max-w-7xl mx-auto px-4 py-8">
      <!-- Add Product Button -->
      <div class="mb-8">
        <button @click="navigateTo('/store/products/new')" class="btn-primary">
          <Icon name="lucide:plus" class="w-5 h-5 inline mr-2" />
          Add New Product
        </button>
      </div>

      <!-- Products List -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">
            Your Products ({{ products.length }})
          </h2>
        </div>

        <!-- Empty State -->
        <div v-if="products.length === 0" class="text-center py-12 card">
          <Icon name="lucide:package-x" class="w-16 h-16 text-gray-300 mx-auto" />
          <p class="text-gray-600 mt-4 text-lg">No products yet</p>
          <p class="text-gray-500 text-sm mt-2">Add your first product to start selling</p>
        </div>

        <!-- Products Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="product in products"
            :key="product._id"
            class="card"
          >
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
              
              <!-- Status Badge -->
              <div
                :class="[
                  'absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold',
                  product.status === 'active' ? 'bg-green-600 text-white' :
                  product.status === 'sold-out' ? 'bg-orange-600 text-white' :
                  'bg-gray-600 text-white'
                ]"
              >
                {{ product.status.toUpperCase() }}
              </div>
            </div>

            <div class="p-4 space-y-3">
              <h3 class="font-semibold text-gray-900 text-lg line-clamp-2">
                {{ product.name }}
              </h3>

              <div class="flex items-end gap-2">
                <span class="text-xl font-bold text-earth-green-800">
                  {{ formatPrice(product.discountedPrice) }}
                </span>
                <span class="text-sm text-gray-500 line-through">
                  {{ formatPrice(product.originalPrice) }}
                </span>
                <span class="text-sm text-red-600 font-medium">
                  -{{ product.discountPercentage }}%
                </span>
              </div>

              <div class="flex items-center justify-between text-sm text-gray-600">
                <span>Qty: {{ product.quantity }}</span>
                <span>Expires: {{ formatDate(product.expiryDate) }}</span>
              </div>

              <div class="flex gap-2 pt-2">
                <button
                  @click="editProduct(product._id)"
                  class="flex-1 py-2 px-3 bg-earth-green-100 text-earth-green-800 rounded-lg hover:bg-earth-green-200 transition-colors text-sm font-medium"
                >
                  <Icon name="lucide:edit" class="w-4 h-4 inline mr-1" />
                  Edit
                </button>
                <button
                  @click="archiveProduct(product._id)"
                  class="flex-1 py-2 px-3 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  <Icon name="lucide:archive" class="w-4 h-4 inline mr-1" />
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const products = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  await loadProducts()
})

const loadProducts = async () => {
  loading.value = true
  error.value = ''

  try {
    // For now, we'll get all products and filter by store
    // In a real app, you'd have a dedicated endpoint for store products
    const { data: session } = await useFetch('/api/auth/session')
    
    if (!session.value?.user || session.value.user.role !== 'store') {
      error.value = 'Access denied. Store account required.'
      return
    }

    const { data } = await useFetch('/api/products')
    if (data.value?.products) {
      // Filter to show only this store's products
      // Note: In production, create a dedicated endpoint
      products.value = data.value.products.filter((p: any) => {
        // This is a simplified filter - in production, match by storeId
        return true
      })
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load products'
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
    month: 'short',
    day: 'numeric',
  })
}

const editProduct = (id: string) => {
  navigateTo(`/store/products/${id}/edit`)
}

const archiveProduct = async (id: string) => {
  if (!confirm('Are you sure you want to archive this product?')) return

  try {
    await $fetch(`/api/products/${id}`, { method: 'DELETE' })
    await loadProducts()
  } catch (err: any) {
    alert(err.data?.message || 'Failed to archive product')
  }
}

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    navigateTo('/auth/login')
  } catch (err) {
    console.error('Logout failed:', err)
  }
}
</script>
