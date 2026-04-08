
export const useBarangStore = defineStore('barang', {
  state: () => ({
    barang: [],
    alert: {
      title: '',
      message: '',
      type: '',
      show: false,
    },
    existingKode: [],
    existingNama: [],
    addedBarang: [],
    errorMessage: null,
    config: {},
  }),
  actions: {
    //client
    addBarang() {
      this.addedBarang.push({
        nama: '',
        kode: '',
        satuan: '',
      })
    },

    removeBarang(index){
      this.addedBarang.splice(index, 1)
    },


    setBarangFromExcel(data){
      if(data.length > 50) {
        for (let i = 0; i < 50; i++) {
          this.addedBarang.push(
            {
              nama: data[i].nama_barang || '',
              kode: data[i].kode_barang || '',
              satuan: data[i].satuan || '',
            }
          )
        }
      }
      if(data.length <= 50) {
        data.forEach(async item => {

          this.addedBarang.push(
            {
              nama: item.nama_barang || '',
              kode: item.kode_barang || '',
              satuan: item.satuan || '',
            }
          )
          // await delay(100)
        })
      }
    },


    //server
    async searchBarang(keyword) {
      const { $api } = useNuxtApp()

      if (!keyword) return []

      try {
        // Simpan hasil pencarian sebelumnya di cache
        if (this.searchCache?.[keyword]) {
          return this.searchCache[keyword]
        }

        const response = await $api.get('/barang/search', { keyword })
        const items = response.item.map(item => ({
          id: item.id,
          nama_barang: item.nama,
          harga: item.harga,
          stok: item.stok,
        }))

        // Simpan hasil pencarian ke cache
        this.searchCache = { ...this.searchCache, [keyword]: items }

        return items
      } catch (error) {
        console.log('Search error:', error)
        return []
      }
    },

    async getBarang() {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.get('/barang')

        this.barang = response.docs
        console.log(this.barang)
        
        return response
      } catch (error) {
        return error
      }
    },
    async getAllBarang() {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.get('/barang/getAllBarang')
        
        console.log(response)
        this.existingKode = response.Barangs.map(barang => barang.kode)
        this.existingNama = response.Barangs.map(barang => barang.nama)
        // console.log(this.barang)
        
        // return response
      } catch (error) {
        return error
      }
    },
    setError(message) {
      this.errorMessage = message
    },
    clearError() {
      this.errorMessage = null
    },

    async storeBarang() {
      const { $api } = useNuxtApp()
      const payload = {barang: this.addedBarang}
      const response = await $api.post('/barang', payload)
      return response
    },
    resetAddedBarang() {
      this.addedBarang = []
    },
    async updateBarang() {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.put('/barang', this.newBarang)
        return response
      } catch (error) {
        return error
      }
    },
    async deleteBarang() {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.delete('/barang', this.newBarang)
        return response
      } catch (error) {
        return error
      }
    },
  },
})
