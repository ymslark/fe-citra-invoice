import { defineStore } from 'pinia'

function useCurrency() {
  const { $formatRupiah, $parseRupiah } = useNuxtApp()
  return { $formatRupiah, $parseRupiah }
}

function getDateNow(){
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const useCFStore = defineStore('cf', {
  state: () => ({
    perusahaan: 'CF',
    barang: [],
    alert: {
      title: '',
      message: '',
      type: '',
      show: false,
    },
    addedBarang: [],
    addedBarangTemp: [],
    daftarSurat: [],
    errorMessage: null,
    newSurat: 
    {
      tanggal: "",
      hal: "Surat Penawaran Barang",
      tujuan: "",
      alamat: "",
      tempo: true,
      tanggal_tempo: "",
      catatan_tempo: "-",
      status: "WAITING",
      atas_nama: "",
      no_rekening: "",
      no_hp: "",
      nama_bank: "",
      catatan: "-",
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
      catatan_tempo: "-",
      status: "WAITING",
      atas_nama: "",
      no_rekening: "",
      nama_bank: "",
      barang: [],
      catatan: "-",
      ongkos_kirim: false,
      instalasi: true,
      ppn: 0,
      no_seri: '',
    },
    config: {},
    rekening: [],
    surat: {},
    addedBarangRequest: [],
    newRequest: {
      tanggal: "",
      tujuan: "",
      alamat: "",
      status: "WAITING",
      catatan: "",
      barang: [],
    },
    
  }),
  getters: {

  },
  actions: {
    parseRupiah(str){
      const { $parseRupiah } = useCurrency()
      return $parseRupiah(str)
    },
    formatRupiah(number, raw = true) {
      const { $formatRupiah } = useCurrency()
      return $formatRupiah(number, raw)
    },
    async getCF() {
      const { $api } = useNuxtApp()
      try {
        const query = {
          limit: 20
        }
        const response = await $api.get('/CF', query)

        this.daftarSurat = response.docs
        console.log(this.daftarSurat)
        
        return response
      } catch (error) {
        return error
      }
    },
    async getCFLast30Days() {
      const { $api } = useNuxtApp()
      try {
        const query = {
          limit: 20
        }
        const response = await $api.get('/CF/last30Days', query)

        this.daftarSurat = response.docs
        console.log(this.daftarSurat)
        
        return response
      } catch (error) {
        return error
      }
    },

    async getCFByPeriods(start, end, page = 1, search = null) {
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
        const response = await $api.get('/CF/getDocumentsByPeriod', query)
        return response.docs

    },

    async getCFDeleted() {
      const { $api } = useNuxtApp()
      try {
        const query = {
          limit: 20
        }
        const response = await $api.get('/CF/deleted', query)

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

    async storeCF() {
      const { $api, $parseRupiah } = useNuxtApp()
      this.newSurat['barang'] = this.addedBarang.map(item => {
        return {
          "nama_barang": item.nama_barang,
          "qty": item.qty,
          "diskon_persen": item.diskon_persen,
          "diskon_nominal": $parseRupiah(item.diskon_nominal),
          "harga": $parseRupiah(item.harga),
        }
      })
      const response = await $api.post('/CF', this.newSurat)
      return response

    },
    async deleteCF(id) {
      const { $api } = useNuxtApp()
      const response = await $api.delete(`/cf/${id}`)     
      console.log(response)  
      return response
    },

    async getBarang() {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.get('/barang')

        this.barang = response.data
        
        return response.data
      } catch (error) {
        console.error('Fetch barang failed:', error)
        this.setError(error.message)
      }
    },

    async getCFById(id) {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.get(`/CF/detail/${id}`)
        let akhir  = 0
        let diskon  = 0
        let total = 0
        this.surat = response.doc
        console.log(response)
        response.doc.barang.forEach(item => {
          diskon += parseInt(item.total_diskon)
          total  += parseInt(item.total_harga_awal)
          akhir  += parseInt(item.total_harga_akhir)
        })
        this.surat['total_harga_awal'] = total
        this.surat['total_diskon'] = diskon
        this.surat['harga_akhir'] = akhir
        
        return response
        
      } catch (error) {
        console.log('Fetch cf failed:', error)
        this.setError(error.message)
        
        return error 
      }
    },
    
    async restoreCF(id){
      //TANPA TRY CATCH
      const { $api } = useNuxtApp()
      const response = await $api.patch(`/CF/restore/${id}`)
      console.log(response)
      return response
    },
    
    async getCFRequest() {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.get('/Request/CF')

        this.daftarSurat = response.docs.docs
        console.log(this.daftarSurat)
        
        return response.docs
      } catch (error) {
        return error
      }
    },

    async getCFRequestById(id) {
      const { $api } = useNuxtApp()
      try {
        const response = await $api.get(`/Request/detail/CF/${id}`)
        console.log(response)
        this.resetNewSurat()
        this.newSurat.tujuan = response.doc.tujuan
        this.newSurat.no_hp = response.doc.no_hp
        this.newSurat.alamat = response.doc.alamat  
        this.newSurat.tanggal = response.doc.tanggal  
        response.doc.barang.forEach(item => {
          this.addedBarang.push({
            "nama_barang": "",
            "nama_barang_request": item.nama_barang,
            "qty": item.qty,
            "diskon_persen": 0,
            "diskon_nominal": 0,
            "harga": 0,
          })
        })
      } catch (error) {
        console.log(error)
      }
    },

    async editSuratCF(id) {
      const { $api } = useNuxtApp()
      const response = await $api.get(`/CF/detail/${id}`)
      console.log(response.doc)
      return response
    },


    async updateCF(id){
      const {$api} = useNuxtApp()
      this.editSurat['barang'] = this.editSurat.barang.map(item => {
        return {
          "nama_barang": item.nama_barang,
          "qty": item.qty,
          "diskon_persen": item.diskon_persen,
          "diskon_nominal": this.parseRupiah(item.diskon_nominal),
          "harga": this.parseRupiah(item.harga),
        }
      })

      const response = await $api.put(`/CF/update/${id}`, this.editSurat)
      console.log(response)
      return response
    },


    addBarang() {
      this.addedBarang.push({
        "_tempId": crypto.randomUUID(),
        "nama_barang": "",
        "qty": 1,
        "diskon_persen": 0,
        "diskon_nominal": 0,
        "harga": 0,
      })
    },
    addBarangEdit() {
      this.editSurat.barang.push({
        "_tempId": crypto.randomUUID(),
        "nama_barang": "",
        "qty": 1,
        "diskon_persen": 0,
        "diskon_nominal": 0,
        "harga": 0,
      })
    },
    deleteBarang(i) {
      console.log(i)
      this.addedBarang.splice(i, 1)
    },
    deleteBarangEdit(i) {
      console.log(i)
      this.editSurat.barang.splice(i, 1)
    },
    deleteBarangByTempId(_tempId) {
      const barang = [...this.addedBarang]
      this.addedBarang = barang.filter(item => item._tempId !== _tempId);
    },
    deleteBarangEditByTempId(_tempId) {
      const barang = [...this.editSurat.barang]
      this.editSurat.barang = barang.filter(item => item._tempId !== _tempId);
    },
    
    insertTempIdEdit() {
      if (this.editSurat.barang.length > 0) {
        this.editSurat.barang = this.editSurat.barang.map(barang => ({
          ...barang,
          _tempId: crypto.randomUUID(),
        }))
      }
    } 
    ,
    async searchBarang(keyword) {
      const { $api } = useNuxtApp()

      if (!keyword) return []

      try {
        // Simpan hasil pencarian sebelumnya di cache
        if (this.searchCache?.[keyword]) {
          return this.searchCache[keyword]
        }

        const response = await $api.get('/barang/search', { keyword })
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
        let rekeningList = response.config.rekening.cf
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
        hal: "Surat Penawaran Barang",
        tujuan: "",
        alamat: "",
        tempo: true,
        tanggal_tempo: "-",
        catatan_tempo: "-",
        status: "WAITING",
        atas_nama: "",
        no_rekening: "",
        nama_bank: "",
        catatan: "",
        ongkos_kirim: false,
        instalasi: true,
        ppn:0,      
    }
    this.addedBarang = []
  },

    resetNewRequest(){
      this.newRequest = {
        tanggal: "",
        tujuan: "",
        alamat: "",
        status: "WAITING",
        catatan: "",
        barang: [],      
      }
  },

  // Request 
  addBarangRequest(){
    this.newRequest.barang.push({
      "nama_barang": "",
      "qty": 1,
    })
  },

  deleteBarangRequest(i) {
    console.log(this.newRequest)
    this.newRequest.barang.splice(i, 1)
  },
  async storeRequestCF(){
    const { $api } = useNuxtApp()
    const response = await $api.post('/Request/CF', this.newRequest)
    return response
  },

  async getCFRequestById(id){
    const { $api } = useNuxtApp()
    const response = await $api.get(`/Request/detail/CF/${id}`)
    console.log(response)
    this.newSurat.tujuan = response.doc.tujuan
    this.newSurat.no_hp = response.doc.no_hp
    this.newSurat.alamat = response.doc.alamat
    response.doc.barang.forEach(item => {
      this.addedBarang.push({
        "_tempId": crypto.randomUUID(),
        "nama_barang": "",
        "nama_barang_request": item.nama_barang,
        "qty": item.qty,
        "diskon_persen": 0,
        "diskon_nominal": 0,
        "harga": 0,
      })
    })
    this.newSurat.tanggal = response.doc.tanggal
  
    // this.surat = response.doc
    // return response
  },
  async setStatusRequest(id){

    const {$api} = useNuxtApp()
    const response = await $api.patch(`/Request/status/${this.perusahaan}/${id}?status=APPROVED`)
    console.log(response)
  }

  },
})
