// import { useAuthStore } from '@/@core/stores/auth'
// import auth from '@/middleware/auth'

// // import dotenv from 'dotenv'
// // env = dotenv.config()
// export default defineNuxtPlugin(nuxtApp => {
//   const BASE_URL =  process.env.API_BASE_URL // Ganti dengan API base URL-mu
//   const authStore = useAuthStore()
//   // console.log(authStore.isLoggedIn, authStore.accessToken)
//   // Fungsi dasar untuk meng-handle request
//   let request = null
//   request = async (method, url, data = {}, customOptions = {}) => {
//     const headers = customOptions.headers || {}
//     // if(!authStore.isLoggedIn && authStore.accessToken == null && authStore.accessToken == undefined ) {
//       // window.location.replace('/admin/login')
//     //   console.log((!authStore.isLoggedIn) )
//     // }
//     if (authStore.accessToken) {
//     headers.Authorization = `Bearer ${authStore.accessToken}`
//     }

//     const options = {
//       method,
//       headers,
//       ...customOptions,
//     }

//     // Menambahkan body hanya untuk metode POST/PUT/PATCH
//     if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
//       options.body = data
//     } else if (method === 'GET' && data && Object.keys(data).length) {
//       // Query params untuk GET
//       const queryString = new URLSearchParams(data).toString()

//       url += `?${queryString}`
//     }

//     try {
//       console.log(await $fetch(BASE_URL + url, options))
//       // return await $fetch(BASE_URL + url, options)

//     } catch (error) {
//       // console.log(error.response._data)
//       // console.log(error.response)
//       error.response._data['code'] = error.response?.status
//       // console.log(authStore.refreshToken)
//       if (error.response?.status === 401 && authStore.refreshToken) {
//         try {
//           console.log('Refreshing access token...')
//           await authStore.refreshAccessToken()
//           headers.Authorization = `Bearer ${authStore.accessToken}`
          
//           return await $fetch(BASE_URL + url, options)
//         } catch (refreshError) {
//           console.log('Refresh token failed:', refreshError)
//           authStore.logout()
//           navigateTo('admin-login')
//           throw refreshError
//         }
//       }
//       throw error.response?._data || error
//     }
//   }
// //   window.location.replace('/admin/login')
// // }

//   // Membuat metode mirip Axios
//   const api = {
//     get: (url, params, options = {}) => request('GET', url, params, options),
//     post: (url, data, options = {}) => request('POST', url, data, options),
//     put: (url, data, options = {}) => request('PUT', url, data, options),
//     patch: (url, data, options = {}) => request('PATCH', url, data, options),
//     delete: (url, data, options = {}) => request('DELETE', url, data, options),
//   }

//   nuxtApp.provide('api', api)
  
//   globalThis.$api = api
// })

import { useAuthStore } from '@/@core/stores/auth'
import auth from '@/middleware/auth'
import { useAlertStore } from '@/stores/alert'

export default defineNuxtPlugin(nuxtApp => {
  const alert= useAlertStore()
  const config = useRuntimeConfig() // pakai runtimeConfig, bukan process.env
  const BASE_URL = config.BASE_URL_API

  const authStore = useAuthStore()

  let request = null
  request = async (method, url, data = {}, customOptions = {}) => {
    const headers = customOptions.headers || {}

    if (authStore.accessToken) {
      headers.Authorization = `Bearer ${authStore.accessToken}`
    }

    const options = {
      method,
      headers,
      ...customOptions,
    }

    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      options.body = data
    } else if (method === 'GET' && data && Object.keys(data).length) {
      const queryString = new URLSearchParams(data).toString()
      url += `?${queryString}`
    }

    try {
      console.log('Request URL:', BASE_URL + url)
      const res = await $fetch(BASE_URL + url, options)
      console.log('Response:', res)
      return res
    } catch (error) {
      console.log(error)
      if (!error.response) {
        // console.log('Network or unexpected error:', error)
        // alert.showAlertObject({ type: 'error', message: 'ERROR_OCCURRED' })
        throw { code: 500, message: 'SERVER_ERROR' }

      }
      error.response._data['code'] = error.response?.status
      if (error.response?.status === 401 && authStore.refreshToken) {
        try {
          console.log('Refreshing access token...')
          await authStore.refreshAccessToken()
          headers.Authorization = `Bearer ${authStore.accessToken}`
          return await $fetch(BASE_URL + url, options)
        } catch (refreshError) {
          console.log('Refresh token failed:', refreshError)
          authStore.logout()
          navigateTo('admin-login')
          throw refreshError
        }
      }
      console.log('Request error:', error)
      throw error.response?._data || error
    }
  }

  const api = {
    get: (url, params, options = {}) => request('GET', url, params, options),
    post: (url, data, options = {}) => request('POST', url, data, options),
    put: (url, data, options = {}) => request('PUT', url, data, options),
    patch: (url, data, options = {}) => request('PATCH', url, data, options),
    delete: (url, data, options = {}) => request('DELETE', url, data, options),
  }

  nuxtApp.provide('api', api)
  globalThis.$api = api
})