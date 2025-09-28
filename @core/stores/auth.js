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
      try {
        // Gunakan $fetch langsung dengan base URL dari runtimeConfig
        const config = useRuntimeConfig()
        console.log('RuntimeConfig:', config) // Debug
        
        const response = await $fetch('/login', {
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

        // Set cookies dengan config yang benar
        const accessTokenCookie = useCookie('accessToken', { 
          maxAge: 60 * 60 * 24 * 7, // 7 hari
          path: '/',
          secure: false, // Sementara false untuk development
          sameSite: 'lax'
        })
        
        const refreshTokenCookie = useCookie('refreshToken', { 
          maxAge: 60 * 60 * 24 * 30, // 30 hari
          path: '/',
          secure: false,
          sameSite: 'lax'
        })
        
        const userCookie = useCookie('user', { 
          maxAge: 60 * 60 * 24 * 7, // 7 hari
          path: '/',
          secure: false,
          sameSite: 'lax'
        })

        // Assign values
        accessTokenCookie.value = response.accessToken
        refreshTokenCookie.value = response.refreshToken
        userCookie.value = response.user
        
        console.log('Cookies set successfully:', {
          accessToken: !!accessTokenCookie.value,
          user: !!userCookie.value
        })
        
        return true
        
      } catch (error) {
        console.error('Login error:', error)
        return false
      }
    },
    
    async refreshAccessToken() {
      try {
        const config = useRuntimeConfig()
        
        const response = await $fetch('/refresh-token', {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: {
            refreshToken: this.refreshToken,
          }
        })
        
        if (!response) throw new Error('Refresh Token Gagal')

        // Update state
        this.accessToken = response.accessToken
        this.refreshToken = response.refreshToken
        this.user = response.user
        this.isLoggedIn = true
        
        console.log('Refresh token success:', response)

        // Update cookies
        const accessTokenCookie = useCookie('accessToken')
        const refreshTokenCookie = useCookie('refreshToken') 
        const userCookie = useCookie('user')

        accessTokenCookie.value = response.accessToken
        refreshTokenCookie.value = response.refreshToken
        userCookie.value = response.user
        
        return true
      } catch (error) {
        console.error('Refresh token error:', error)
        this.logout()
        return false
      }
    },
    
    logout() {
      // Clear state
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      this.isLoggedIn = false
      
      // Clear cookies
      const accessTokenCookie = useCookie('accessToken', { maxAge: 0 })
      const refreshTokenCookie = useCookie('refreshToken', { maxAge: 0 })
      const userCookie = useCookie('user', { maxAge: 0 })

      accessTokenCookie.value = null
      refreshTokenCookie.value = null
      userCookie.value = null
      
      console.log('Logout successful')
      
      // Redirect to login
      navigateTo('/login')
    },
    
    initAuth() {
      // Ambil dari cookies
      const accessTokenCookie = useCookie('accessToken')
      const refreshTokenCookie = useCookie('refreshToken')
      const userCookie = useCookie('user')
      
      console.log('Init Auth - Cookies:', {
        accessToken: accessTokenCookie.value ? 'exists' : 'empty',
        refreshToken: refreshTokenCookie.value ? 'exists' : 'empty',
        user: userCookie.value ? 'exists' : 'empty'
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