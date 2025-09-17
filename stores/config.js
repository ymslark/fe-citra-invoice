import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  //raw state,
  state: () => ({

  }),
  //actions
  actions: {
    async getConfig() {
      const { $api } = useNuxtApp()
      const response = await $api.get('/config')
      console.log(response)
    },
    
    
    async updateConfig(newConfig) {
      const { $api } = useNuxtApp()
      const { data } = await $api.put('/config', newConfig)
      this.config = data
      console.error('Error updating config:', error)
    },
  },
  //getters
  getters: {
    getPerusahaan() {
      return this.perusahaan
    },
    getBarang() {
      return this.barang
    },
    getAlert() {
      return this.alert
    },
    getConfig() {
      return this.config
    },
    getRekening() {
      return this.rekening
    },
  },
})
