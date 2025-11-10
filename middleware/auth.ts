export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data } = await useFetch('/api/auth/session')
  
  if (!data.value?.user) {
    return navigateTo('/auth/login')
  }
})
