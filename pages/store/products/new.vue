<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center gap-4">
          <button @click="navigateTo('/store/dashboard')" class="text-gray-600 hover:text-earth-green-800">
            <Icon name="lucide:arrow-left" class="w-6 h-6" />
          </button>
          <h1 class="text-xl font-semibold text-gray-900">Add New Product</h1>
        </div>
      </div>
    </header>

    <!-- Form -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <form @submit.prevent="handleSubmit" class="card p-8 space-y-6">
        <!-- Product Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="input-field"
            placeholder="e.g., Fresh Baguette"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="input-field resize-none"
            placeholder="Brief description of the product..."
          ></textarea>
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            v-model="form.category"
            required
            class="input-field"
          >
            <option value="">Select category</option>
            <option value="meat">Meat</option>
            <option value="vegetables">Vegetables</option>
            <option value="dairy">Dairy</option>
            <option value="bakery">Bakery</option>
            <option value="fruits">Fruits</option>
            <option value="prepared-food">Prepared Food</option>
            <option value="other">Other</option>
          </select>
        </div>

        <!-- Image URL (simplified for MVP) -->
        <div>
          <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-2">
            Product Image URL *
          </label>
          <input
            id="imageUrl"
            v-model="form.imageUrl"
            type="url"
            required
            class="input-field"
            placeholder="https://example.com/image.jpg"
          />
          <p class="text-sm text-gray-500 mt-1">
            Enter a direct link to the product image
          </p>
          <div v-if="form.imageUrl" class="mt-3">
            <img :src="form.imageUrl" alt="Preview" class="h-32 rounded-lg object-cover" />
          </div>
        </div>

        <!-- Expiry Date -->
        <div>
          <label for="expiryDate" class="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date *
          </label>
          <input
            id="expiryDate"
            v-model="form.expiryDate"
            type="date"
            required
            :min="minDate"
            class="input-field"
          />
        </div>

        <!-- Quantity -->
        <div>
          <label for="quantity" class="block text-sm font-medium text-gray-700 mb-2">
            Quantity Available *
          </label>
          <input
            id="quantity"
            v-model.number="form.quantity"
            type="number"
            required
            min="1"
            class="input-field"
            placeholder="10"
          />
        </div>

        <!-- Pricing -->
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label for="originalPrice" class="block text-sm font-medium text-gray-700 mb-2">
              Original Price (VND) *
            </label>
            <input
              id="originalPrice"
              v-model.number="form.originalPrice"
              type="number"
              required
              min="0"
              step="1000"
              class="input-field"
              placeholder="50000"
            />
          </div>

          <div>
            <label for="discountedPrice" class="block text-sm font-medium text-gray-700 mb-2">
              Discounted Price (VND) *
            </label>
            <input
              id="discountedPrice"
              v-model.number="form.discountedPrice"
              type="number"
              required
              min="0"
              step="1000"
              class="input-field"
              placeholder="25000"
            />
          </div>
        </div>

        <!-- Discount Preview -->
        <div v-if="discountPercentage > 0" class="bg-earth-green-50 border border-earth-green-200 rounded-lg p-4">
          <div class="flex items-center gap-2 text-earth-green-800">
            <Icon name="lucide:tag" class="w-5 h-5" />
            <span class="font-medium">Discount: {{ discountPercentage }}% OFF</span>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <!-- Submit Buttons -->
        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="submitting"
            class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="submitting" class="flex items-center justify-center gap-2">
              <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
              Adding Product...
            </span>
            <span v-else>Add Product</span>
          </button>
          <button
            type="button"
            @click="navigateTo('/store/dashboard')"
            class="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const form = ref({
  name: '',
  description: '',
  category: '',
  imageUrl: '',
  expiryDate: '',
  quantity: 1,
  originalPrice: 0,
  discountedPrice: 0,
})

const submitting = ref(false)
const error = ref('')

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const discountPercentage = computed(() => {
  if (form.value.originalPrice > 0 && form.value.discountedPrice > 0) {
    return Math.round(
      ((form.value.originalPrice - form.value.discountedPrice) / form.value.originalPrice) * 100
    )
  }
  return 0
})

const handleSubmit = async () => {
  // Validation
  if (form.value.discountedPrice >= form.value.originalPrice) {
    error.value = 'Discounted price must be less than original price'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/products', {
      method: 'POST',
      body: {
        name: form.value.name,
        description: form.value.description,
        category: form.value.category,
        images: [form.value.imageUrl],
        expiryDate: form.value.expiryDate,
        quantity: form.value.quantity,
        originalPrice: form.value.originalPrice,
        discountedPrice: form.value.discountedPrice,
      },
    })

    if (response.success) {
      alert('Product added successfully!')
      navigateTo('/store/dashboard')
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to add product'
    submitting.value = false
  }
}
</script>
