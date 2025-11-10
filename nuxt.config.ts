// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-mongoose',
    'nuxt-auth-utils',
    '@vite-pwa/nuxt'
  ],

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
  },

  mongoose: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/rescue-eats',
    options: {},
    modelsDir: 'server/models',
    devtools: true,
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Rescue Eats',
      short_name: 'Rescue Eats',
      description: 'Rescue near-expiry food, save money, save the planet',
      theme_color: '#166534',
      background_color: '#ffffff',
      icons: [
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/rescue-eats',
    sessionPassword: process.env.NUXT_SESSION_PASSWORD || 'rescue-eats-session-secret-min-32-chars-long',
    public: {
      appName: 'Rescue Eats',
    }
  },

  typescript: {
    strict: false,
    typeCheck: false,
  },
})
