// // plugins/pinia.js
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin(useNuxtApp => {
  const { $pinia } = useNuxtApp

  $pinia.use(piniaPluginPersistedstate)

  // nuxtApp.vueApp.use(pinia)
})
