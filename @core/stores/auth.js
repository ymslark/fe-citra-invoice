import { nav } from '@/views/demos/components/list/demoCodeList'
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
        const { $api } = useNuxtApp()
        const response = await $api.post('/login', credentials)
        if(!response) throw { message: 'Login Gagal' }
        console.log(response)

        this.accessToken = response.accessToken
        this.refreshToken = response.refreshToken
        this.user = response.user
        this.isLoggedIn = true

        const accessToken= useCookie('accessToken', { path: '/' })
        const refreshToken= useCookie('refreshToken', { path: '/' })
        const user= useCookie('user', { path: '/' }) // 7 hari
        
        accessToken.value = response.accessToken
        refreshToken.value = response.refreshToken
        user.value = response.user
        
        return true
      } catch (error) {
        console.log(error)
        
        return false
        
        // return error.message || 'Login Gagal'
        
      }
    },
    
    async refreshAccessToken() {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.post('/refresh-token', {
          refreshToken: this.refreshToken,
        })
        if (!response) throw { message: 'Refresh Token Gagal' }

        this.accessToken = response.accessToken
        this.refreshToken = response.refreshToken
        this.user = response.user
        thhis.isLoggedIn = true
        console.log('refresh token function')
        console.log(response)
        useCookie('accessToken').value = response.accessToken
        useCookie('refreshToken').value = response.refreshToken
        useCookie('user').value = response.user
        return true
      } catch (error) {
        console.log('refreshToken error')
        console.log(error)
        return false
      }
    },
    
    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      this.isLoggedIn = false
      
      // Hapus cookies
      const accessToken = useCookie('accessToken', {maxAge: 0*0, path: '/'})
      const refreshToken = useCookie('refreshToken', {maxAge: 0*0, path: '/'})
      const user = useCookie('user', {maxAge: 0*0, path: '/'})

      accessToken.value = null
      refreshToken.value = null
      user.value = null

      // navigateTo('/admin/login')
    },
    
    initAuth() {
      // if(process.client){
        const accessToken = useCookie('accessToken', {path: '/'})
        const refreshToken = useCookie('refreshToken', {path: '/'})
        const user = useCookie('user', {path: '/'})
        // if ((accessToken != null || accessToken != undefined) && (refreshToken != null || refreshToken != undefined)) 
    if(accessToken.value && refreshToken.value && user.value)  
        {
          this.accessToken = accessToken.value
          this.refreshToken = refreshToken.value
          this.user = user.value
          this.isLoggedIn = true 
        }
        else {
          this.accessToken = null
          this.refreshToken = null
          this.user = null
          this.isLoggedIn = false
          // navigateTo('/login')
      }
    },

  },
})
