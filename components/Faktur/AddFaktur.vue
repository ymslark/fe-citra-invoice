<template>
  <div>
    <VCard>
      <VForm>
        <VCardTitle class="text-h5">Request Faktur Pajak</VCardTitle>
        <div>
          <VCardItem>
              <VRow>
                <VCol cols="12" md="6">
                  <VSelect class="mt-2"
                    :items="['Offline', 'Marketplace']"
                    label="Tempat Pemesanan"
                    v-model="tempat"
                    outlined :rules="[requiredValidator]" />
                </VCol>
                <VCol cols="8" v-if="tempat == 'Offline'"><VTextField class="mt-2" v-model="seri" label="no_seri" variant="outlined" :rules="[requiredValidator]"/></VCol>
                <VCol v-if="tempat == 'Offline'">
                  <VBtn class="mt-2" color="primary" @click="getSurat">
                    Cari
                  </VBtn>
                </VCol>
              </VRow>
          </VCardItem>
        </div>
        <VCardItem v-if="true">
          <VRow>
            <VCol cols="12" md="6" class="d-flex flex-column ga-4 mt-2">
              <VTextField v-model="form.pembeli.nama_pembeli" label="Nama Pembeli" required outlined :rules="[requiredValidator]" />
              <VTextField v-model="form.pembeli.no_hp" label="No Hp" required outlined :rules="[requiredValidator]" />
              <VTextarea v-model="form.pembeli.alamat" label="Alamat" required outlined :rules="[requiredValidator]" rows="1" auto-grow />
              <VTextField v-model="form.pembeli.npwp" label="NPWP" required outlined :rules="[requiredValidator]" />
              
              <AppDateTimePicker label="Tanggal Pembelian" v-model="form.tanggal_pembelian" required outlined :rules="[requiredValidator]" />
              <!-- <VTextField label="Nama Pelanggan" required outlined :rules="[requiredValidator]" />
              <VTextField label="Nama Pelanggan" required outlined :rules="[requiredValidator]" /> -->
            </VCol>
            <VCol cols="12" md="6">
              <!-- <VFileInput label="File input" @change="uploadImage" v-model="file" /> -->
              <VImg v-if="previewUrl" :src="previewUrl" class="mt-2" max-height="350" contain />
              <VFileInput accept="image/jpeg, image/png, image/jpg" label="Masukkan Gambar NPWP"
                @change="handleFileChange" :rules="fileRules" show-size class="mt-5" />
            </VCol>
            <VCol cols="6">
              <VImg v-if="url" :src="url" class="mt-2" max-height="350" contain />
            </VCol>
          
            <VCol class="d-flex justify-end">
              <VBtn color="primary" @click="addBarang">Tambah Barang</VBtn>
            </VCol>
            
            <VCol cols="12" v-for="(item, index) in faktur.newFaktur.barang" :key="item._tempId">
              <FakturAddBarangFaktur :barang="item" :index="index" :_tempId="item._tempId"/>
            </VCol>
          </VRow>
        </VCardItem>
        <VCardItem>
          <VRow>
            <VCol>
              <VBtn color="primary" @click="uploadImage()">Kirim </VBtn>
            </VCol>
          </VRow>
        </VCardItem>
      </VForm>
    </VCard>      
  </div> 
</template>

<script setup>

import {useFakturStore} from '@/stores/faktur.js'
const faktur = useFakturStore()
const seri = ref('')
const tempat = ref('Offline')
const config = useRuntimeConfig()
const form = faktur.newFaktur
const baseUrl = config.public.apiUrl // Ganti dengan URL API yang sesuai
const url = ref('')

const tempFile = ref(null)
const file = ref(tempFile)
const previewUrl = ref(null)
const fileRules = [
  () => !!file.value || 'File wajib diisi',
  () => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.value.type) || 'ekstensi yang diperbolehkan hanyalah .jpg, .jpeg, .png',
  () => file.value.size < 2000000 || 'ukuran file maksimal 2MB',
]
//menangani file untuk diupload

const handleFileChange = (event) => {
  console.log()

  const selectedFile = event.target.files[0];
  if (selectedFile) {
    tempFile.value = selectedFile;
  }
  console.log(event.target.files)
};

const uploadImage = async () => {  
  try {
    const { $api } = useNuxtApp()
    if (!file.value) {
      // console.error('No file selected');
      alert.showAlertObject({
        type: 'error',
        message: 'Tidak ada file yang dipilih',
      })
      return;
    }
    let data = JSON.parse(JSON.stringify(faktur.newFaktur))
    data['barang'] = faktur.newFaktur.barang.map(item => ({
      nama_barang: item.nama_barang,
      harga: parseInt(item.harga.replace(/\./g, '')) || 0,
      qty: item.qty,
      total: (parseInt(item.harga.replace(/\./g, '')) || 0) * item.qty
    }))
    // console.log(finalBarangFaktur)
    const formData = new FormData();
    formData.append('gambar', file.value);
    formData.append('faktur', JSON.stringify(data));
    // console.log('Form data prepared for upload:', formData);
  
    console.log(formData.get('faktur'))
    let response = null
    response = await $api.post('/faktur', formData)
    url.value = baseUrl + '/public/images/' + response.filename
      console.log(response, 'response');
      console.log(url.value);
    alert.showAlertObject({
      type: 'success',
      message: 'Gambar Berhasil di-upload',
    })
  } catch (error) {
    console.log(error)
    alert.showAlertObject({
      type: 'error',
      message: error.message || 'Gagal mengupload gambar',
    })
  }
};
watch(file, (newFile) => {
  if (newFile) {
    previewUrl.value = URL.createObjectURL(newFile)
    console.log(URL.createObjectURL(newFile))

  }
  //  // }
})
const logFile = (files) => {
  console.log('File yang dipilih:', files)
  // console.log(file.value.files)
}

const surat = ref(null)
const refForm = ref()
// const seri = ref('')

const getSurat = async () => {
  try {
    const { $api } = useNuxtApp()
    const response = await $api.get('/faktur/getSurat/', {no_seri:seri.value})
    surat.value = response.surat
    console.log(surat)
    form.pembeli.nama_pembeli= surat.value.tujuan
    form.pembeli.alamat = surat.value.alamat ||  'Alamat.....'
    form.pembeli.no_hp = surat.value.no_hp ||  'No Hp.....'
    form.barang = surat.value.barang.map(item => ({
      nama_barang: item.nama_barang,
      harga: item.harga_akhir,
      qty: item.qty,
      total: item.harga_akhir * item.qty
    }))


  } catch (error) {
    console.error('Error fetching surat:', error)
  }
}


const addBarang = () => {
  faktur.addBarang('new')
}
</script>
