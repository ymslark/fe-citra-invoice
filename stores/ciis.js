import { defineStore } from 'pinia'

function useCurrency() {
  const { $formatRupiah, $parseRupiah } = useNuxtApp()
  return { $formatRupiah, $parseRupiah }
}

export const useCiStore = defineStore('ciis', {
  state: () => ({
    perusahaan: 'CII',
    interior: [],
    alert: {
      title: '',
      message: '',
      type: '',
      show: false,
    },
    addedInterior: [],
    addedInteriorTemp: [],
    daftarSurat: [],
    errorMessage: null,
    newSurat: 
    {
      no_hp: "",
      tanggal: "",
      hal: "Surat Penawaran Interior",
      tujuan: "",
      alamat: "",
      tempo: true,
      tanggal_tempo: "",
      catatan_tempo: "",
      status: "WAITING",
      atas_nama: "",
      no_rekening: "",
      nama_bank: "",
      catatan: "",
      ongkos_kirim: false,
      instalasi: true,
      ppn: 0,
    },
    editSurat: 
    {
      no_hp: "",
      tanggal: "",
      hal: "",
      tujuan: "",
      alamat: "",
      tempo: "",
      tanggal_tempo: "",
      catatan_tempo: "",
      status: "WAITING",
      atas_nama: "",
      no_rekening: "",
      nama_bank: "",
      interior: [],
      catatan: "",
      ongkos_kirim: false,
      instalasi: true,
      ppn: 0,
      no_seri: '',
    },
    config: {},
    rekening: [],
    surat: {},
    addedInteriorRequest: [],
    newRequest: {
      tanggal: "",
      tujuan: "",
      alamat: "",
      status: "WAITING",
      catatan: "",
      no_hp: "",
      interior: [],
    },
    
  }),
  actions: {
    parseRupiah(str){
      const { $parseRupiah } = useCurrency()
      return $parseRupiah(str)
    },
    formatRupiah(number, raw = true) {
      const { $formatRupiah } = useCurrency()
      return $formatRupiah(number, raw)
    },    
    async getCII() {
      const { $api } = useNuxtApp()
      try {
        const query = {
          limit: 20
        }
        const response = await $api.get('/CII', query)

        this.daftarSurat = response.docs
        console.log(this.daftarSurat)
        
        return response
      } catch (error) {
        return error
      }
    },
    async getCIILast30Days() {
      const { $api } = useNuxtApp()
      try {
        const query = {
          limit: 20
        }
        const response = await $api.get('/CII/last30Days', query)

        this.daftarSurat = response.docs
        console.log(this.daftarSurat)
        
        return response
      } catch (error) {
        return error
      }
    },

    async getCIIByPeriods(start, end, page = 1, search = null) {
      const { $api } = useNuxtApp()
        const query = {
          start_date: start,
          end_date: end,
          limit: 20
        }
      if (page) {
        query.page = page
      }
      if (search) {
        query.keyword = search
      }
        const response = await $api.get('/CII/getDocumentsByPeriod', query)
        return response.docs

    },

    async getCIIDeleted() {
      const { $api } = useNuxtApp()
      try {
        const query = {
          limit: 20
        }
        const response = await $api.get('/CII/deleted', query)

        this.daftarSurat = response.docs
        console.log(this.daftarSurat)
        
        return response
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

    async storeCII() {
      const { $api } = useNuxtApp()
      this.newSurat['interior'] = this.addedInterior.map(item => {
        return {
          "nama_interior": item.nama_interior,
          v1: item.v1,
          v2: item.v2,
          "diskon_persen": item.diskon_persen,
          "diskon_nominal": item.diskon_nominal,
          "harga": item.harga,
        }
      })
      const response = await $api.post('/CII', this.newSurat)
      return response

    },
    async deleteCII(id) {
      const { $api } = useNuxtApp()
      const response = await $api.delete(`/cii/${id}`)     
      console.log(response)  
      return response
    },

    async getInterior() {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.get('/interior')

        this.interior = response.data
        
        return response.data
      } catch (error) {
        console.error('Fetch interior failed:', error)
        this.setError(error.message)
      }
    },

    async getCIIById(id) {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.get(`/CII/detail/${id}`)
        let akhir  = 0
        let diskon  = 0
        let total = 0
        this.surat = response.doc
        console.log(response)
        response.doc.interior.forEach(item => {
          diskon += parseInt(item.total_diskon)
          total  += parseInt(item.total_harga_awal)
          akhir  += parseInt(item.total_harga_akhir)
        })
        this.surat['total_harga_awal'] = total
        this.surat['total_diskon'] = diskon
        this.surat['harga_akhir'] = akhir
        
        return response
        
      } catch (error) {
        console.log('Fetch cii failed:', error)
        this.setError(error.message)
        
        return error 
      }
    },
    
    async restoreCII(id){
      //TANPA TRY CATCH
      const { $api } = useNuxtApp()
      const response = await $api.patch(`/CII/restore/${id}`)
      console.log(response)
      return response
    },
    
    async getCIIRequest() {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.get('/Request/CII')

        this.daftarSurat = response.docs.docs
        console.log(this.daftarSurat)
        
        return response.docs
      } catch (error) {
        return error
      }
    },

    async getCIIRequestById(id) {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.get(`/Request/detail/CII/${id}`)
        console.log(response)
        this.resetNewSurat()
        this.newSurat.tujuan = response.doc.tujuan
        this.newSurat.alamat = response.doc.alamat  
        this.newSurat.tanggal = response.doc.tanggal  
        response.doc.interior.forEach(item => {
          this.addedInterior.push({
            "nama_interior": item.nama_interior,
            "nama_interior_request": item.nama_interior,
            v1: item.v1, 
            v2: item.v2,
            "diskon_persen": 0,
            "diskon_nominal": 0,
            "harga": 0,
          })
        })
      } catch (error) {
        console.log(error)
      }
    },

    async editSuratCII(id) {
      const { $api } = useNuxtApp()
      const response = await $api.get(`/CII/detail/${id}`)
      console.log(response.doc)
      return response
    },


    async updateCII(id){
      const {$api} = useNuxtApp()
      const response = await $api.put(`/CII/update/${id}`, this.editSurat)
      
      console.log(response)
      return response
    },


    addInterior() {
      this.addedInterior.push({
        "nama_interior": "",
        "qty": 1,
        "diskon_persen": 0,
        "diskon_nominal": 0,
        "harga": 0,
      })
    },
    addInteriorEdit() {
      this.editSurat.interior.push({
        "nama_interior": "",
        "qty": 1,
        "diskon_persen": 0,
        "diskon_nominal": 0,
        "harga": 0,
      })
    },
    deleteInterior(_tempId) {
      const interior = [...this.newRequest.interior]
      this.newRequest.interior = interior.filter(item => item._tempId !== _tempId);
    },
    deleteInteriorEdit(i) {
      console.log(i)
      this.editSurat.interior.splice(i, 1)
    },
    async searchInterior(keyword) {
      const { $api } = useNuxtApp()

      if (!keyword) return []

      try {
        // Simpan hasil pencarian sebelumnya di cache
        if (this.searchCache?.[keyword]) {
          return this.searchCache[keyword]
        }

        const response = await $api.get('/interior/search', { keyword })
        const items = response.item.map(item => item.nama)
        console.log(items)
        // Simpan hasil pencarian ke cached
        
        this.searchCache = { ...this.searchCache, [keyword]: items }

        return items
      } catch (error) {
        console.log('Search error:', error)
        return []
      }
    },
    async getConfig(){
      const { $api } = useNuxtApp()
      try {
        const response = await $api.get('/getConfig')

        console.log(response)
        this.config = response.config
        let rekeningList = response.config.rekening.cii
        this.config.rekening = rekeningList.map(item => {
          return {
            title: item.atas_nama + ' (' + item.nama_bank + ')',
            desc: item.no_rekening,
            value: {
              atas_nama: item.atas_nama,
              nama_bank: item.nama_bank,
              no_rekening: item.no_rekening,
            },
            icon: {
              icon: 'tabler-building-bank',
              size: '28',
            },
            current: false,
          }
        })

        // return response
      } catch (error) {
        console.error('Fetch config failed:', error)
        this.setError(error.message)
        
        return error
      }
    },

    setAlertNull() {
      this.alert = {
        title: '',
        message: '',
        type: '',
        show: false,
      }
    },

    resetNewSurat(){
      this.newSurat = {
        tanggal: "",
        hal: "Surat Penawaran Interior",
        tujuan: "",
        alamat: "",
        tempo: true,
        tanggal_tempo: "",
        catatan_tempo: "",
        status: "WAITING",
        atas_nama: "",
        no_rekening: "",
        nama_bank: "",
        catatan: "",
        ongkos_kirim: false,
        instalasi: true,
        ppn:0,      
    }
    this.addedInterior = []
  },

    resetNewRequest(){
      this.newRequest = {
        tanggal: "",
        tujuan: "",
        alamat: "",
        status: "WAITING",
        catatan: "",
        interior: [],      
      }
  },

  // Request 
  addInteriorRequest(){
    this.newRequest.interior.push({
      _tempId: crypto.randomUUID(),
      nama_interior: "",
      v1: "1",
      v2: "1",
    })
  },

  deleteInteriorRequest(i) {
    console.log(this.newRequest)
    this.newRequest.interior.splice(i, 1)
  },
  async storeRequestCII(){
    const { $api } = useNuxtApp()
    this.newRequest['interior'] = this.newRequest.interior.map(item => {
      return {
        nama_interior: item.nama_interior,
        v1: parseFloat(item.v1),
        v2: parseFloat(item.v2),
      }
    })
    console.log(this.newRequest['interior'])
    const response = await $api.post('/Request/CII', this.newRequest)
    return response
  },

  async setStatusRequest(id){

    const {$api} = useNuxtApp()
    const response = await $api.patch(`/Request/status/${this.perusahaan}/${id}?status=APPROVED`)
    console.log(response)
  }

},
  getters: {

    // getRekeningRadio: state => {
    //   let rekeningList = []

    //   console.log(this.config.rekening)
    //   state.rekening.forEach((rekening, i) => {
    //     rekeningList.push({
    //       title: rekening.atas_nama + ' ( ' + rekening.nama_bank + ' )',
    //       label: rekening.no_rekening,
    //       value: rekening,
    //     })
    //   })
      
    //   return state.config
    //   console.log(rekeningList)
      
    //   return rekeningList
    // },
  },
})
