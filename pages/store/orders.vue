<template>
  <div class="min-h-screen bg-gray-50">
    <!-- SEO -->
    <Head>
      <Title>Quản lý đơn hàng | Rescue Eats</Title>
      <Meta name="description" content="Quản lý đơn hàng của cửa hàng" />
      <Meta name="robots" content="noindex, nofollow" />
    </Head>

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center gap-4">
          <button @click="navigateTo('/store/dashboard')" class="text-gray-600 hover:text-earth-green-800">
            <Icon name="lucide:arrow-left" class="w-6 h-6" />
          </button>
          <h1 class="text-xl font-semibold text-gray-900">Quản lý đơn hàng</h1>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 py-12 text-center">
      <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-earth-green-800 mx-auto" />
      <p class="text-gray-600 mt-2">Đang tải đơn hàng...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 py-12 text-center">
      <Icon name="lucide:alert-circle" class="w-12 h-12 text-red-600 mx-auto" />
      <p class="text-red-600 mt-2">{{ error }}</p>
    </div>

    <!-- Orders Management -->
    <div v-else class="max-w-7xl mx-auto px-4 py-8">
      <!-- Filter Tabs -->
      <div class="mb-6 flex flex-wrap gap-2">
        <button
          v-for="tab in filterTabs"
          :key="tab.value"
          @click="currentFilter = tab.value"
          class="px-4 py-2 rounded-lg font-medium transition-colors"
          :class="currentFilter === tab.value 
            ? 'bg-earth-green-800 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-100'"
        >
          {{ tab.label }}
          <span v-if="getCountByStatus(tab.value) > 0" class="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-sm">
            {{ getCountByStatus(tab.value) }}
          </span>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="filteredOrders.length === 0" class="text-center py-12 bg-white rounded-lg">
        <Icon name="lucide:inbox" class="w-16 h-16 text-gray-300 mx-auto" />
        <p class="text-gray-600 mt-4">Không có đơn hàng {{ currentFilter === 'all' ? '' : filterTabs.find(t => t.value === currentFilter)?.label.toLowerCase() }}</p>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-4">
        <div
          v-for="order in filteredOrders"
          :key="order._id"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ getStatusText(order.status) }}
                </span>
                <span class="text-sm text-gray-500">{{ formatDate(order.reservedAt) }}</span>
              </div>
              
              <h3 class="text-lg font-semibold text-gray-900">{{ order.productSnapshot?.name }}</h3>
              <p class="text-sm text-gray-600 mt-1">
                Khách hàng: {{ order.userId?.name }} | Số lượng: {{ order.quantity }}
              </p>
              
              <div class="mt-3 flex items-center gap-2">
                <Icon name="lucide:ticket" class="w-4 h-4 text-gray-600" />
                <span class="font-mono font-semibold text-earth-green-800">{{ order.voucherCode }}</span>
              </div>

              <div v-if="order.cancellationReason" class="mt-2 text-sm text-red-600">
                Lý do hủy: {{ order.cancellationReason }}
              </div>
            </div>

            <div class="text-right">
              <div class="text-xl font-bold text-earth-green-800">{{ formatPrice(order.totalPrice) }}</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
            <button
              v-if="order.status === 'pending'"
              @click="handleOrderAction(order._id, 'confirm')"
              :disabled="actionLoading"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Icon name="lucide:check" class="w-4 h-4 inline mr-1" />
              Xác nhận
            </button>

            <button
              v-if="order.status === 'confirmed'"
              @click="handleOrderAction(order._id, 'ready')"
              :disabled="actionLoading"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <Icon name="lucide:package-check" class="w-4 h-4 inline mr-1" />
              Sẵn sàng lấy
            </button>

            <button
              v-if="order.status === 'ready' || order.status === 'confirmed'"
              @click="handleOrderAction(order._id, 'complete')"
              :disabled="actionLoading"
              class="px-4 py-2 bg-earth-green-600 text-white rounded-lg hover:bg-earth-green-700 disabled:opacity-50"
            >
              <Icon name="lucide:check-circle" class="w-4 h-4 inline mr-1" />
              Hoàn thành
            </button>

            <button
              v-if="order.status !== 'completed' && order.status !== 'cancelled'"
              @click="showCancelDialog(order._id)"
              :disabled="actionLoading"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <Icon name="lucide:x-circle" class="w-4 h-4 inline mr-1" />
              Hủy đơn
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Dialog -->
    <div v-if="cancelDialog.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Hủy đơn hàng</h3>
        <p class="text-gray-600 mb-4">Vui lòng nhập lý do hủy đơn:</p>
        <textarea
          v-model="cancelDialog.reason"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-earth-green-600 focus:border-transparent"
          rows="3"
          placeholder="Nhập lý do..."
        ></textarea>
        <div class="flex gap-3 mt-4">
          <button
            @click="confirmCancel"
            :disabled="!cancelDialog.reason || actionLoading"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Xác nhận hủy
          </button>
          <button
            @click="cancelDialog.show = false"
            class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const orders = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const actionLoading = ref(false)
const currentFilter = ref('all')

const cancelDialog = ref({
  show: false,
  orderId: '',
  reason: ''
})

const filterTabs = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ xác nhận', value: 'pending' },
  { label: 'Đã xác nhận', value: 'confirmed' },
  { label: 'Sẵn sàng lấy', value: 'ready' },
  { label: 'Hoàn thành', value: 'completed' },
  { label: 'Đã hủy', value: 'cancelled' },
]

onMounted(async () => {
  await loadOrders()
})

const filteredOrders = computed(() => {
  if (currentFilter.value === 'all') return orders.value
  return orders.value.filter((o: any) => o.status === currentFilter.value)
})

const getCountByStatus = (status: string) => {
  if (status === 'all') return orders.value.length
  return orders.value.filter((o: any) => o.status === status).length
}

const loadOrders = async () => {
  loading.value = true
  error.value = ''

  try {
    // Get orders for this store
    const { data } = await useFetch('/api/orders', {
      params: { storeOnly: true }
    })
    if (data.value?.orders) {
      orders.value = data.value.orders
    }
  } catch (err: any) {
    error.value = err.message || 'Không thể tải đơn hàng'
  } finally {
    loading.value = false
  }
}

const handleOrderAction = async (orderId: string, action: string) => {
  actionLoading.value = true

  try {
    const response = await $fetch(`/api/orders/${orderId}/manage`, {
      method: 'POST',
      body: { action }
    })

    if (response.success) {
      await loadOrders()
      alert('Cập nhật đơn hàng thành công')
    }
  } catch (err: any) {
    alert(err.data?.message || 'Không thể cập nhật đơn hàng')
  } finally {
    actionLoading.value = false
  }
}

const showCancelDialog = (orderId: string) => {
  cancelDialog.value = {
    show: true,
    orderId,
    reason: ''
  }
}

const confirmCancel = async () => {
  actionLoading.value = true

  try {
    const response = await $fetch(`/api/orders/${cancelDialog.value.orderId}/manage`, {
      method: 'POST',
      body: {
        action: 'cancel',
        reason: cancelDialog.value.reason
      }
    })

    if (response.success) {
      cancelDialog.value.show = false
      await loadOrders()
      alert('Đã hủy đơn hàng')
    }
  } catch (err: any) {
    alert(err.data?.message || 'Không thể hủy đơn hàng')
  } finally {
    actionLoading.value = false
  }
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': 'Chờ xác nhận',
    'confirmed': 'Đã xác nhận',
    'ready': 'Sẵn sàng lấy',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy',
    'expired': 'Đã hết hạn'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-700'
    case 'confirmed':
      return 'bg-green-100 text-green-700'
    case 'ready':
      return 'bg-indigo-100 text-indigo-700'
    case 'completed':
      return 'bg-earth-green-100 text-earth-green-700'
    case 'cancelled':
    case 'expired':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

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
</script>
