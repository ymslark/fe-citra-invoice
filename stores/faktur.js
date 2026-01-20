import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
// import {crypto} from 'crypto'
function useCurrency() {
  const { $formatRupiah, $parseRupiah } = useNuxtApp()
  return { $formatRupiah, $parseRupiah }
}

export const useFakturStore = defineStore('faktur', {
  state: () => ({
    newFaktur: {
      pembeli: {
        nama_pembeli: '',
        alamat: '',
        npwp: '',
      },
      barang: [],
      tanggal: '',
      tanggal_pembelian: '',
    }
    , editFaktur: {
      pembeli: {
        nama_pembeli: '',
        alamat: '',
        npwp: '',
        no_hp: '',
      },
      barang: [],
      tanggal: '',
      tanggal_pembelian: '',
      status: '',
    }
  }),
  actions: {
    addBarang(type) {
      // type = 'new' || 'edit'
      let rawItem = {
        _tempId: uuidv4(),
        nama_barang: '',
        qty: 0,
        harga: 0,
        keterangan: '',
      }
      if (type == 'new') this.newFaktur.barang.push(rawItem)
      else if (type == 'edit') this.editFaktur.barang.push(rawItem)
    },

    insertTempId(type) {
      // type = 'new' || 'edit'
      if (type == 'new' && this.newFaktur.barang.length > 0) {
        this.newFaktur.barang = this.newFaktur.barang.map(barang => ({
          ...barang,
          _tempId: uuidv4(),
        }))
      } else if (type == 'edit' && this.editFaktur.barang.length > 0) {
        this.editFaktur.barang = this.editFaktur.barang.map(barang => ({
          ...barang,
          _tempId: uuidv4(),
        }))
      }
    },

    removeBarang(id, type) {
      if (type === 'new') {
        this.newFaktur.barang = this.newFaktur.barang.filter(barang => barang._tempId !== id)
      } else if (type === 'edit') {
        this.editFaktur.barang = this.editFaktur.barang.filter(barang => barang._tempId !== id)
      }
    },
    async getSurat(no_seri) {
      const { $api } = useNuxtApp()
      if (!no_seri) throw new Error('NO_SERI_REQUIRED')
        console.log(no_seri)
      try {
        const response = await $api.get('/faktur/getSurat?no_seri='+ no_seri )
        if(response){
          this.newFaktur.barang = response.surat.barang
          this.newFaktur.pembeli.nama = response.surat.tujuan
          this.newFaktur.penjual.nama = response.surat.no_seri.split('/')[0]

        }
        return response
      } catch (error) {
        console.error('Error fetching surat:', error)
        return error
      }
    },
    getFakturById(id) {
      this.editFaktur = { ...faktur }
      this.insertTempId('edit')
    }
    ,
    hapusBarangByTempId(_tempId) {
      const barang = [...this.newFaktur.barang]
      this.newFaktur.barang = barang.filter(item => item._tempId !== _tempId);
    },

    resetNewFaktur() {
      this.newFaktur = {
        pembeli: { 
          nama_pembeli: '',
          alamat: '',
          npwp: '',
        },
        barang: [],
        tanggal: '',
        tanggal_pembelian: '',
      }
    },
    // async updateFaktur(id, formData) {
    //   const { $api } = useNuxtApp()
    //   console.log(id)
    //   // if (!id) throw new Error('ID_REQUIRED')
    //   const response = await $api.put('/faktur/' + id, formData)
    //   console.log(formData)
    //   return response
    // },
    async hapusFaktur(id){
      const { $api } = useNuxtApp()
      if (!id) throw new Error('ID_REQUIRED')
      const response = await $api.delete('/faktur/' + id)
      return response
    },
    async restoreFaktur(id){
      const { $api } = useNuxtApp()
      if (!id) throw new Error('ID_REQUIRED')
      const response = await $api.put('/faktur/restore/' + id)
      return response
    }
  },
  getters: {
    getNewFaktur() {
      return this.newFaktur
    },
    getEditFaktur() {
      return this.editFaktur
    },
  },
  // persist: {
  //   storage: localStorage,
  //   paths: ['newFaktur', 'editFaktur'],
  // }

})
