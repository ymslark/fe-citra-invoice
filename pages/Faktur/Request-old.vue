<template>
  <div>
    <VContainer>
      <Alert/>
      <VCard>
        <VCardTitle>Request Faktur</VCardTitle>
        <VCardItem>Masukkan No_seri</VCardItem>
        <!-- <VForm > -->
          <VCardText>
          <VRow>
            <VCol cols="12" md="6">
              <VTextField v-model="seri" label="No Seri" variant="outlined" required />
            </VCol>
            <VCol cols="12" md="6">
              <VBtn color="primary" @click="getSurat">Cari</VBtn>
            </VCol>
          </VRow>
          </VCardText>
        <!-- </VForm> -->
      </VCard>

      <VCard class="mt-2" v-if="surat">
        <VCardTitle>Isi Data</VCardTitle>
        <VCardText>
          <VRow>

            <VCol cols="12" md="6">
              <AppTextField v-model="newFaktur.pembeli.nama" label="Nama Pembeli" variant="outlined" />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextarea rows="1" auto-grow v-model="newFaktur.pembeli.alamat" label="Alamat Pembeli" variant="outlined" />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextarea rows="1" auto-grow v-model="newFaktur.pembeli.npwp" label="NPWP" variant="outlined" />
            </VCol>
            <VCol cols="12" md="6">
              <VImg v-if="previewUrl" :src="previewUrl" class="mt-2" max-height="350" contain />
              <VFileInput accept="image/jpeg, image/png, image/jpg" label="Masukkan Gambar NPWP"
                @change="handleFileChange" :rules="fileRules" show-size class="mt-5" />
            </VCol>
            <VCol cols="12" md="6">
              <VImg v-if="url" :src="url" class="mt-2" max-height="350" contain />
            </VCol>
          </VRow>
          <VRow>
            <VCol>
              <VBtn color="primary" @click="uploadImage()">Upload Gambar</VBtn>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
      <!-- <VCard class="mt-4" v-if="surat">
        <VCardTitle>
          Daftar Barang
        </VCardTitle>
        <VSpacer />
        <VCardItem>
          <VCol cols="12" offset-md="8" md="4" />
          <VCol cols="12">
            <VTable fixed-header class="text-no-wrap">
              <thead>
                <tr>
                  <th class="text-uppercase">
                    No.
                  </th>
                  <th class="text-uppercase">
                    Nama Barang
                  </th>
                  <th class="text-uppercase">
                    qty
                  </th>
                  <th class="text-uppercase">
                    Harga
                  </th>
                  <th class="text-uppercase">
                    Diskon Nominal
                  </th>
                  <th class="text-uppercase">
                    Diskon Persen
                  </th>
                  <th class="text-uppercase">
                    Total Harga
                  </th>
                  <th class="text-uppercase">
                    Total Diskon
                  </th>
                  <th class="text-uppercase">
                    Harga Akhir
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in surat.barang" :key="index">
                  <td>
                    {{ index + 1 }}
                  </td>
                  <td>
                    {{ item.nama_barang }}
                  </td>
                  <td>
                    {{ item.qty }}
                  </td>
                  <td>
                    Rp{{ formatRupiah(item.harga) }}
                  </td>
                  <td>
                    {{ item.diskon_nominal }}
                  </td>
                  <td>
                    {{ item.diskon_persen }}%
                  </td>
                  <td>
                    Rp{{ formatRupiah(item.total_harga) }}
                  </td>
                  <td>
                    Rp{{ formatRupiah(item.total_diskon) }}
                  </td>
                  <td>
                    Rp{{ formatRupiah(item.harga_akhir) }}
                  </td>
                </tr>


                <tr>
                  <td colspan="7" />
                  <td class="text-bold">
                    Total
                  </td>
                  <td>Rp{{ formatRupiah(surat.total_harga) }}</td>
                </tr>
                <tr>
                  <td colspan="7" />
                  <td class="text-bold">
                    Total Diskon
                  </td>
                  <td>Rp{{ formatRupiah(surat.total_diskon) }}</td>
                </tr>

                <tr v-if="surat.ppn > 0">
                  <td colspan="7" />
                  <td class="text-bold">
                    PPN {{ surat.ppn }}%
                  </td>
                  <td>Rp{{ formatRupiah(Math.ceil((surat.harga_akhir * surat.ppn) / 100 / 1000) * 1000) }}</td>
                </tr>

                <tr>
                  <td colspan="7" />
                  <td class="text-bold">
                    Harga Akhir
                  </td>
                  <td>
                    Rp{{ formatRupiah(surat.harga_akhir + Math.ceil((surat.harga_akhir * surat.ppn) / 100 / 1000) *
                      1000) }}
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VCol>
        </VCardItem>
      </VCard> -->
    </VContainer>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'blank'
})
import {useAlertStore} from '@/stores/alert'
import {useFakturStore} from '@/stores/faktur'
import {formatRupiah} from '@/utils/format'
const surat = ref(null)
const alert = useAlertStore()
const faktur = useFakturStore()
const refForm = ref()
const seri = ref('')
const newFaktur = faktur.newFaktur
const getSurat = async () => {
  try {
    const response = await faktur.getSurat(seri.value)
    surat.value = true
    console.log(response)
    if (!surat.value) throw {...response}
    alert.showAlertObject({
      message: 'Berhasil mengambil surat',
      type: 'success',
    })
    console.log('Surat fetched successfully:', surat.value)
  } catch (error) {

    alert.showAlertObject({
      message: error.message || 'Gagal mengambil surat',
      type: 'error',
    })
    surat.value = null
    // console.error('Error fetching surat:', error)
  }
}

const storeFaktur = async () => {
  try {
    await faktur.storeFaktur(surat.value)
    alert.showAlertObject({
      message: 'Berhasil menyimpan faktur',
      type: 'success',
    })
  } catch (error) {
    alert.showAlertObject({
      message: error.message || 'Gagal menyimpan faktur',
      type: 'error',
    })
  }
}

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
      console.error('No file selected');
      return;
    }
    const formData = new FormData();
    let string = JSON.stringify(faktur.newFaktur)
    formData.append('gambar', file.value);
    formData.append('faktur', JSON.stringify(string));
    // console.log('Form data prepared for upload:', formData);
  
    console.log(formData.get('gambar'))
    let response = null
    for( let i = 0; i < 1; i++) {
      response = await $api.post('/Faktur', formData)
      url.value = baseUrl + '/public/images/' + response.filename
        console.log(response, 'response');
        console.log(url.value);
    }
      alert.showAlertObject({
        type: 'success',
        message: 'Gambar Berhasil di-upload',
      })
  } catch (error) {
    console.log(error)
    alert.showAlertObject({
      type: 'error',
      message: 'Gagal mengupload gambar',
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
console.log(newFaktur.pembeli)
</script>
