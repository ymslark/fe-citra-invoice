import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    user: null,
    isLoggedIn: false,
  }),

  actions: {
    async login(credentials) {
      const { $api } = useNuxtApp()
      try {
        const config = useRuntimeConfig()
        console.log('RuntimeConfig:', config)

        const response = await $api.post('/login', {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: credentials
        })

        if (!response) throw new Error('Login Gagal')
        console.log('Login Response:', response)

        // Set state
        this.accessToken = response.accessToken
        this.refreshToken = response.refreshToken
        this.user = response.user
        this.isLoggedIn = true

        // Set cookies (client only)
        useCookie('accessToken', { maxAge: 60 * 60 * 24 * 7, path: '/' }).value = response.accessToken
        useCookie('refreshToken', { maxAge: 60 * 60 * 24 * 30, path: '/' }).value = response.refreshToken
        useCookie('user', { maxAge: 60 * 60 * 24 * 7, path: '/' }).value = response.user

        console.log('Cookies set successfully')
        return true
      } catch (error) {
        console.error('Login error:', error)
        return false
      }
    },

    async refreshAccessToken() {
      try {
        const config = useRuntimeConfig()
        const { $api } = useNuxtApp()
        const response = await $api.post('/refresh-token', {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: { refreshToken: this.refreshToken }
        })

        if (!response) throw new Error('Refresh Token Gagal')

        this.accessToken = response.accessToken
        this.refreshToken = response.refreshToken
        this.user = response.user
        this.isLoggedIn = true

        // Update cookies
        useCookie('accessToken').value = response.accessToken
        useCookie('refreshToken').value = response.refreshToken
        useCookie('user').value = response.user

        console.log('Refresh token success')
        return true
      } catch (error) {
        console.error('Refresh token error:', error)
        this.logout()
        return false
      }
    },

    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      this.isLoggedIn = false

      // Clear cookies
      useCookie('accessToken').value = null
      useCookie('refreshToken').value = null
      useCookie('user').value = null

      console.log('Logout successful')
      navigateTo('/login')
    },

    initAuth() {
      const accessTokenCookie = useCookie('accessToken')
      const refreshTokenCookie = useCookie('refreshToken')
      const userCookie = useCookie('user')

      console.log('Init Auth - Cookies:', {
        accessToken: !!accessTokenCookie.value,
        refreshToken: !!refreshTokenCookie.value,
        user: !!userCookie.value
      })

      if (accessTokenCookie.value && refreshTokenCookie.value && userCookie.value) {
        this.accessToken = accessTokenCookie.value
        this.refreshToken = refreshTokenCookie.value
        this.user = userCookie.value
        this.isLoggedIn = true
        console.log('Auth initialized from cookies')
      } else {
        this.accessToken = null
        this.refreshToken = null
        this.user = null
        this.isLoggedIn = false
        console.log('No auth data found in cookies')
      }
    },
  },
})
