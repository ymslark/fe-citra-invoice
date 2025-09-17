import { useAuthStore } from '@/@core/stores/auth'

export default defineNuxtRouteMiddleware(to => {
  const authStore = useAuthStore()
  authStore.initAuth()

  if (to.meta.public)

  return

  // Periksa autentikasi
  if(process.client ) {
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
    if(userRole == undefined && userRole == null) {
      if (to.meta.roles && !to.meta.roles.includes(userRole)) {
        console.log(userRole)
        return navigateTo({name: 'not-authorized'})
      }
    }
  }
})
