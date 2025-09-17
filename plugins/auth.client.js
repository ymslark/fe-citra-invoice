import { useAuthStore } from '@/@core/stores/auth'

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  authStore.initAuth() // Inisialisasi auth saat aplikasi dimuat
})
