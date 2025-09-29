import { useAuthStore } from '@/@core/stores/auth'

export default defineNuxtPlugin(() => {
  if (process.client) {
    const authStore = useAuthStore()
    authStore.initAuth() // Inisialisasi auth hanya di sisi client
  }
})