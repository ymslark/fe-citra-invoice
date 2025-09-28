import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

const {$api} = useNuxtApp()

export const useMemoStore = defineStore('memo', {
  state: () => ({
    newMemo: {
      tanggal: '',
      tujuan: '',
      barang: [],
      perusahaan: '',
      id_supir: '',
      alamat: '',
      jenis_memo: '',
    },
    editMemo: {
      tanggal: '',
      tujuan: '',
      barang: [],
      perusahaan: '',
      id_supir: '',
      alamat: '',
      jenis_memo: '',
      status: ''
    },
  }),
  actions: {

    addBarang(type){
      // type = 'new' || 'edit'
      let rawItem = {
        _tempId: uuidv4(),
        nama_barang: '',
        qty: 0,
        keterangan: '',
      }
      if(type == 'new') this.newMemo.barang.push(rawItem)
      else if(type == 'edit') this.editMemo.barang.push(rawItem)
    },

    addBarang(type){
      // type = 'new' || 'edit'
      let rawItem = {
        _tempId: uuidv4(),
        nama_barang: '',
        qty: 0,
        keterangan: '',
      }
      if(type == 'new') this.newMemo.barang.push(rawItem)
      else if(type == 'edit') this.editMemo.barang.push(rawItem)
    },

    //insert temporary id to barang
    insertTempId(type){
      // type = 'new' || 'edit'
      if(type == 'new' && this.newMemo.barang.length > 0){
        this.newMemo.barang = this.newMemo.barang.map(barang => ({
          ...barang,
          _tempId: uuidv4(), // atau Date.now() atau counter manual
      }))
    }
      else if(type == 'edit' && this.editMemo.barang.length > 0){
        this.editMemo.barang = this.editMemo.barang.map(barang => ({
          ...barang,
          _tempId: uuidv4(), // atau Date.now() atau counter manual
      }))
      }
    }
    ,

    removeBarang(id, type) {
      this.editMemo.barang = this.editMemo.barang.filter(barang => barang._tempId !== id)
      // if(type === 'add') 
      // else if(type === 'edit') this.editMemo.barang = editMemo.barang.filter(barang => barang._tempId !== id)

    }
    ,
    resetNewMemo(){
      this.newMemo = {
        tanggal: '',
        tujuan: '',
        barang: [],
        perusahaan: '',
        id_supir: '',
        alamat: '',
        jenis_memo: '',
      }
    }
    ,


  //async


    async getAllMemo(){
      const response = await $api.get('/Memo')
      console.log(response)
      return response
    },


    async getDataSurat(id, perusahaan){
      const {$api} = useNuxtApp()
      const response = await $api.get(`/${perusahaan}/detail/${id}`)
      console.log(response)
      return response
    },

    async addMemo(id, perusahaan){
      let data = await this.getDataSurat(id, perusahaan)
      let pt = { CF: 'PT. Citra Furniture Indonesia', 
                 CII: 'PT. Citra Interior Indonesia',
                 SCI: 'PT. Sentral Citra Indonesia',
      }
      console.log(data)
      this.newMemo.tujuan = data.doc.tujuan
      this.newMemo.alamat = data.doc.alamat
      this.newMemo.jenis_memo = data.doc.jenis_memo
      // this.newMemo.tanggal
      this.newMemo.perusahaan = pt[perusahaan]
      if(['CF', 'SCI'].includes(perusahaan)){
        this.newMemo.barang = data.doc.barang.map(item => {
          return {
            nama_barang: item.nama_barang,
            qty: item.qty,
            keterangan: '',
          }
        })
      }
      if(perusahaan === 'CII'){
        this.newMemo.barang = data.doc.interior.map(item => {
          return {
            nama_barang: item.nama_interior,
            qty: 1,
            keterangan: `${item.v1}x${item.v2}m`,
          }
        })

      }

      console.log(this.newMemo)
      return data
    },

    async getMemoById(id){
      const { $api } = useNuxtApp()
      const response = await $api.get(`/Memo/detail/${id}`)
      console.log(response)
      return response
    }

    ,
    async storeMemo(){
      const { $api } = useNuxtApp()
      const response = await $api.post('/Memo', this.newMemo)
      console.log(response)
      return response
    },

    async updateMemo(id){
      const { $api } = useNuxtApp()
      const response = await $api.put(`/Memo/update/${id}`, this.editMemo)
      console.log(response)
      return response
    },

    async deleteMemo(id){
      const { $api } = useNuxtApp()
      const response = await $api.delete(`/Memo/${id}`)
      console.log(response)
      return response
    },
    async restoreMemo(id){
      const { $api } = useNuxtApp()
      const response = await $api.patch(`/Memo/restore/${id}`)
      console.log(response)
      return response
    },

    async updateStatus(id){
      const { $api } = useNuxtApp()
      
    }


  },
  getters: {

  }
})
