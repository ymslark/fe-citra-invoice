import { useAuthStore } from "@/@core/stores/auth"
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  authStore.initAuth()
  
  if (to.meta.public) return    
  
  if (to.meta.requiresAuth && authStore.isLoggedIn === false) {
      console.log(to.meta.requiresAuth)
      console.log(authStore.isLoggedIn)
      return navigateTo({name: 'admin-login'})
  }
  
  if (to.meta.unauthenticatedOnly && isLoggedIn) {
    return navigateTo({name: 'admin-CF'})
  }

  // Periksa role jika ada
  const userRole = authStore.user?.role
  if (!userRole) {
    return navigateTo({name: '404'})
  }

  if (authStore.isLoggedIn && userRole && to.meta.roles && !to.meta.roles.includes(userRole)) {
    return navigateTo('/admin-not-authorized')
  }
})

