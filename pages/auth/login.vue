<template>
  <div class="min-h-screen bg-gradient-to-br from-earth-green-50 to-white flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-2 mb-2">
          <Icon name="lucide:leaf" class="w-10 h-10 text-earth-green-800" />
          <h1 class="text-3xl font-bold text-earth-green-800">Rescue Eats</h1>
        </div>
        <p class="text-gray-600">Sign in to your account</p>
      </div>

      <!-- Login Card -->
      <div class="card p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="email"
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
              v-model="password"
              type="password"
              required
              class="input-field"
              placeholder="••••••••"
            />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <div v-if="pendingMessage" class="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg text-sm">
            {{ pendingMessage }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="mt-6 text-center">
          <p class="text-gray-600 text-sm">
            Don't have an account?
            <NuxtLink to="/auth/register" class="text-earth-green-800 font-medium hover:underline">
              Sign up
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
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const pendingMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  pendingMessage.value = ''

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    })

    if (response.success) {
      // Check if user is a store with pending status
      if (response.status === 'pending' || response.user?.storeStatus === 'pending') {
        pendingMessage.value = response.message || 'Your store account is pending approval.'
        loading.value = false
        return
      }

      // Redirect based on role
      if (response.user?.role === 'store') {
        navigateTo('/store/dashboard')
      } else {
        navigateTo('/')
      }
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Login failed. Please check your credentials.'
    loading.value = false
  }
}
</script>
