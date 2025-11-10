<template>
  <div class="min-h-screen bg-gray-50">
    <!-- SEO -->
    <Head>
      <Title>Đơn hàng của tôi | Rescue Eats</Title>
      <Meta name="description" content="Quản lý và theo dõi các đơn hàng cứu vãn thực phẩm của bạn" />
      <Meta name="robots" content="noindex, nofollow" />
    </Head>

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center gap-4">
          <button @click="navigateTo('/')" class="text-gray-600 hover:text-earth-green-800">
            <Icon name="lucide:arrow-left" class="w-6 h-6" />
          </button>
          <h1 class="text-xl font-semibold text-gray-900">Đơn hàng của tôi</h1>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 py-12 text-center">
      <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-earth-green-800 mx-auto" />
      <p class="text-gray-600 mt-2">Đang tải đơn hàng...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 py-12 text-center">
      <Icon name="lucide:alert-circle" class="w-12 h-12 text-red-600 mx-auto" />
      <p class="text-red-600 mt-2">{{ error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="orders.length === 0" class="max-w-4xl mx-auto px-4 py-12 text-center">
      <Icon name="lucide:receipt" class="w-16 h-16 text-gray-300 mx-auto" />
      <p class="text-gray-600 mt-4 text-lg">Chưa có đơn hàng nào</p>
      <p class="text-gray-500 text-sm mt-2">Bắt đầu cứu vãn thực phẩm để xem đơn hàng tại đây</p>
      <button @click="navigateTo('/')" class="btn-primary mt-6">
        Xem Deals
      </button>
    </div>

    <!-- Orders List -->
    <div v-else class="max-w-4xl mx-auto px-4 py-8">
      <div class="space-y-6">
        <OrderSummaryCard
          v-for="order in orders"
          :key="order._id"
          :order="order"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const orders = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  await loadOrders()
})

const loadOrders = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data } = await useFetch('/api/orders')
    if (data.value?.orders) {
      orders.value = data.value.orders
    }
  } catch (err: any) {
    error.value = err.message || 'Không thể tải đơn hàng'
  } finally {
    loading.value = false
  }
}
</script>
