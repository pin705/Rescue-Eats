<template>
  <div class="min-h-screen bg-gradient-to-br from-earth-green-50 to-white flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-2 mb-2">
          <Icon name="lucide:leaf" class="w-10 h-10 text-earth-green-800" />
          <h1 class="text-3xl font-bold text-earth-green-800">Rescue Eats</h1>
        </div>
        <p class="text-gray-600">Create your account</p>
      </div>

      <!-- Account Type Selection -->
      <div class="flex gap-4 mb-6">
        <button
          @click="accountType = 'customer'"
          :class="[
            'flex-1 py-3 px-4 rounded-lg font-medium transition-all border-2',
            accountType === 'customer'
              ? 'bg-earth-green-800 text-white border-earth-green-800'
              : 'bg-white text-gray-700 border-gray-300 hover:border-earth-green-600'
          ]"
        >
          <Icon name="lucide:user" class="w-5 h-5 inline mr-2" />
          Customer
        </button>
        <button
          @click="accountType = 'store'"
          :class="[
            'flex-1 py-3 px-4 rounded-lg font-medium transition-all border-2',
            accountType === 'store'
              ? 'bg-earth-green-800 text-white border-earth-green-800'
              : 'bg-white text-gray-700 border-gray-300 hover:border-earth-green-600'
          ]"
        >
          <Icon name="lucide:store" class="w-5 h-5 inline mr-2" />
          Store
        </button>
      </div>

      <!-- Registration Card -->
      <div class="card p-8">
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              {{ accountType === 'store' ? 'Owner Name' : 'Full Name' }}
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="input-field"
              :placeholder="accountType === 'store' ? 'John Doe' : 'Your name'"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="input-field"
              placeholder="••••••••"
            />
          </div>

          <!-- Store-specific fields -->
          <template v-if="accountType === 'store'">
            <div class="border-t pt-4">
              <p class="text-sm font-medium text-gray-700 mb-4">Store Information</p>
              
              <div class="space-y-4">
                <div>
                  <label for="storeName" class="block text-sm font-medium text-gray-700 mb-2">
                    Store Name
                  </label>
                  <input
                    id="storeName"
                    v-model="form.storeName"
                    type="text"
                    required
                    class="input-field"
                    placeholder="My Store"
                  />
                </div>

                <div>
                  <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                    Store Address
                  </label>
                  <textarea
                    id="address"
                    v-model="form.address"
                    required
                    rows="2"
                    class="input-field resize-none"
                    placeholder="123 Street Name, District, City"
                  ></textarea>
                </div>

                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    class="input-field"
                    placeholder="+84 123 456 789"
                  />
                </div>
              </div>
            </div>

            <div class="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg text-sm">
              <Icon name="lucide:info" class="w-4 h-4 inline mr-1" />
              Your store account will be pending until approved by admin.
            </div>
          </template>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
              Creating account...
            </span>
            <span v-else>Create Account</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="mt-6 text-center">
          <p class="text-gray-600 text-sm">
            Already have an account?
            <NuxtLink to="/auth/login" class="text-earth-green-800 font-medium hover:underline">
              Sign in
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Back to Home -->
      <div class="text-center mt-6">
        <NuxtLink to="/" class="text-gray-600 hover:text-earth-green-800 text-sm flex items-center justify-center gap-1">
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const accountType = ref<'customer' | 'store'>('customer')
const loading = ref(false)
const error = ref('')

const form = ref({
  name: '',
  email: '',
  password: '',
  storeName: '',
  address: '',
  phone: '',
})

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  try {
    const body: any = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      role: accountType.value,
    }

    if (accountType.value === 'store') {
      body.storeName = form.value.storeName
      body.address = {
        street: form.value.address,
        phone: form.value.phone,
      }
    }

    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body,
    })

    if (response.success) {
      if (accountType.value === 'store') {
        // Show pending message for stores
        alert('Account created! Your store is pending approval. You will be notified once approved.')
        navigateTo('/auth/login')
      } else {
        // Redirect customer to home
        navigateTo('/')
      }
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Registration failed. Please try again.'
    loading.value = false
  }
}
</script>
