<template>
  <div class="w-full space-y-4">
    <!-- Main Search Bar -->
    <div class="relative">
      <div class="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-earth-green-600 transition-colors shadow-sm">
        <Icon name="lucide:search" class="w-5 h-5 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for food deals..."
          class="flex-1 outline-none text-gray-900 placeholder-gray-400"
          @input="$emit('search', searchQuery)"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="text-gray-400 hover:text-gray-600"
        >
          <Icon name="lucide:x" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Location Filter -->
    <div class="flex items-center gap-2">
      <div class="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5">
        <Icon name="lucide:map-pin" class="w-5 h-5 text-earth-green-700" />
        <input
          v-model="locationQuery"
          type="text"
          placeholder="Enter location or use current"
          class="flex-1 outline-none text-sm text-gray-900 placeholder-gray-400"
        />
      </div>
      <button
        @click="getCurrentLocation"
        class="bg-earth-green-800 hover:bg-earth-green-900 text-white p-2.5 rounded-lg transition-colors"
        title="Use current location"
      >
        <Icon name="lucide:locate-fixed" class="w-5 h-5" />
      </button>
    </div>

    <!-- Quick Filter Chips -->
    <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        v-for="filter in quickFilters"
        :key="filter.value"
        @click="selectFilter(filter.value)"
        :class="[
          'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border',
          selectedFilter === filter.value
            ? 'bg-earth-green-800 text-white border-earth-green-800'
            : 'bg-white text-gray-700 border-gray-200 hover:border-earth-green-600'
        ]"
      >
        <Icon :name="filter.icon" class="w-4 h-4 inline mr-1.5" />
        {{ filter.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['search', 'filter', 'location'])

const searchQuery = ref('')
const locationQuery = ref('')
const selectedFilter = ref<string | null>(null)

const quickFilters = [
  { label: 'All', value: null, icon: 'lucide:grid-2x2' },
  { label: 'Meat', value: 'meat', icon: 'lucide:beef' },
  { label: 'Vegetables', value: 'vegetables', icon: 'lucide:carrot' },
  { label: 'Dairy', value: 'dairy', icon: 'lucide:milk' },
  { label: 'Bakery', value: 'bakery', icon: 'lucide:croissant' },
  { label: 'Fruits', value: 'fruits', icon: 'lucide:apple' },
  { label: '50%+ OFF', value: 'discount-50', icon: 'lucide:tag' },
  { label: '70%+ OFF', value: 'discount-70', icon: 'lucide:tags' },
]

const clearSearch = () => {
  searchQuery.value = ''
  emit('search', '')
}

const selectFilter = (value: string | null) => {
  selectedFilter.value = value
  emit('filter', value)
}

const getCurrentLocation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        locationQuery.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        emit('location', { lat: latitude, lng: longitude })
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to get your location. Please enter manually.')
      }
    )
  } else {
    alert('Geolocation is not supported by your browser.')
  }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
