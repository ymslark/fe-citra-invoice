<script setup>
import {useFakturStore} from '@/stores/faktur.js'
import {useAlertStore} from '@/stores/alert.js'
import { formatTanggalIndonesia, formatRupiah } from '@/utils/format'
const faktur = useFakturStore()
const route = useRoute()
const id = route.params.id || null
const alert = useAlertStore()
const url = ref('')
const baseUrl = 'http://localhost:3900'; // Ganti dengan URL API yang sesuai
// const faktur.editFaktur = faktur.faktur.editFaktur

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

const updateFaktur = async () => {  
  try {
    const { $api } = useNuxtApp()

    let data = JSON.parse(JSON.stringify(faktur.editFaktur))
    delete data['pembeli']['gambar_npwp']
    data['barang'] = faktur.editFaktur.barang.map(item => ({
      nama_barang: item.nama_barang,
      harga: parseInt(item.harga.replace(/\./g, '')) || 0,
      qty: item.qty,
      total: (parseInt(item.harga.replace(/\./g, '')) || 0) * item.qty
    }))
    // console.log(finalBarangFaktur)
    const formData = new FormData();
    if(file.value) {
      formData.append('gambar', file.value);
    }
    formData.append('faktur', JSON.stringify(data));
    // console.log('Form data prepared for upload:', formData);
  
    console.log(formData.get('faktur'))
    let response = null
    response = await $api.put(`/faktur/${id}`, formData)
     if(response){
      window.scrollTo(0, 0)
      alert.showAlertObject({
        type: 'success',
        message: 'Berhasil Mengubah Faktur',
      })
      setTimeout(() => {
        navigateTo({ name: 'admin-faktur-detail-id', params: { id } })
      }, 2000)
    }
    url.value = baseUrl + '/public/images/' + response.filename
      console.log(response, 'response');
      console.log(url.value);
    // alert.showAlertObject({
    //   type: 'success',
    //   message: 'Gambar Berhasil di-upload',
    // })
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












if (id) {
  try {
    const {$api} = useNuxtApp()
    const response = await $api.get(`/Faktur/detail/${id}`)
    faktur.editFaktur = response.faktur
    // faktur.editFaktur.value = faktur.faktur.editFaktur
  } catch (error) {
    console.error("Error fetching Faktur data:", error)
    // Handle error, e.g., show an alert or redirect
    alert.showAlertObject({
      message: 'Gagal mengambil data Faktur',
      type: 'error',
    })
    setTimeout(() => {
      navigateTo({ name: 'admin-faktur' })
    }, 4000)
  }
}

// async function updateFaktur(){
//   try {
//     const response = await faktur.updateFaktur(id)
//     if(response){
//       window.scrollTo(0, 0)
//       alert.showAlertObject({
//         message: 'Berhasil Mengubah Faktur',
//         type: 'success',
//       })
//     }
//     setTimeout(() => {
//       navigateTo({ name: 'admin-faktur-detail-id', params: { id } })
//     }, 2000)
//     console.log(response)
//   } catch (error) {
//     console.error("Error updating Faktur data:", error)
//     window.scrollTo(0, 0)
//     alert.showAlertObject({
//       message: error.message || 'Gagal Mengubah Faktur',
//       type: 'error',
//     })
//     // Handle error, e.g., show an alert
//   }
// }
</script>
<template>
  <div>
    <VRow>
      <VCol cols = "12" md="6">
        <VForm>
          <VCard>
            <VCardTitle>
              Edit Permintaan Faktur pajak
            </VCardTitle>
            <VCardItem>
              <VRow>
                <VCol cols="12">
                  <VTextField class="mt-3"
                    label="Nama"
                    v-model="faktur.editFaktur.pembeli.nama_pembeli"
                    outlined
                  />
                </VCol>
                <VCol cols="12">
                  <VTextarea
                    rows="1"
                    auto-grow
                    label="Alamat"
                    outlined
                    v-model="faktur.editFaktur.pembeli.alamat"
                    clearable
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    label="NPWP"
                    outlined
                    v-model="faktur.editFaktur.pembeli.npwp"
                    clearable
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    label="No. HP"
                    outlined
                    v-model="faktur.editFaktur.pembeli.no_hp"
                    clearable
                  />
                </VCol>
                <VCol cols="12">
                  <AppDateTimePicker
                    label="Tanggal Pengajuan Faktur"
                    v-model="faktur.editFaktur.tanggal"
                    outlined
                    clearable
                  />
                </VCol>
                <VCol cols="12">
                  <AppDateTimePicker
                    label="Tanggal Pembelian"
                    v-model="faktur.editFaktur.tanggal_pembelian"
                    outlined
                    clearable
                  />
                </VCol>
              </VRow>
            </VCardItem>
          </VCard>
        </VForm>
      </VCol>
      <!-- <VCol cols="12" md="6" order-md="1" order="2">
        <VCard>
          <VCardText class="d-flex flex-column gap-y-6">
            <h5 class="text-h5">
              Detail Pembeli
            </h5>

            <div class="d-flex gap-x-3 align-center">
              <VAvatar
                variant="tonal"
                size="large"
              >
                <VIcon icon="tabler-user" />
              </VAvatar>
              <div>
                <h6 class="text-h6">
                 Nama
                </h6>
                <div class="text-body-1">
                 {{faktur.editFaktur.pembeli.nama_pembeli}}
                </div>
              </div>
            </div>
            <div class="d-flex gap-x-3 align-center">
              <VAvatar
                variant="tonal"
                size="large"
              >
                <VIcon icon="tabler-map-pin" />
              </VAvatar>
              <div>
                <h6 class="text-h6">
                 Alamat
                </h6>
                <div class="text-body-1">
                 {{faktur.editFaktur.pembeli.alamat}}
                </div>
              </div>
            </div>
            <div class="d-flex gap-x-3 align-center">
              <VAvatar
                variant="tonal"
                size="large"              >
                <VIcon icon="tabler-phone" />
              </VAvatar>
              <div>
                <h6 class="text-h6">
                 No. Hp
                </h6>
                <div class="text-body-1">
                 {{faktur.editFaktur.pembeli.no_hp}}
                </div>
              </div>
            </div>
            <div class="d-flex gap-x-3 align-center">
              <VAvatar
                variant="tonal"
                size="large"
              >
                <VIcon icon="tabler-receipt-tax" />
              </VAvatar>
              <div>
                <h6 class="text-h6">
                 NPWP
                </h6>
                <div class="text-body-1">
                 {{faktur.editFaktur.pembeli.npwp}}
                </div>
              </div>
            </div>
            <div class="d-flex gap-x-3 align-center">
              <VAvatar
                variant="tonal"
                size="large"
              >
                <VIcon icon="tabler-calendar" />
              </VAvatar>
              <div>
                <h6 class="text-h6">
                 Tanggal Pengajuan Faktur
                </h6>
                <div class="text-body-1">
                 {{formatTanggalIndonesia(faktur.editFaktur.tanggal)}}
                </div>
              </div>
            </div>
            <div class="d-flex gap-x-3 align-center">
              <VAvatar
                variant="tonal"
                size="large"
              >
                <VIcon icon="tabler-calendar-check" />
              </VAvatar>
              <div>
                <h6 class="text-h6">
                 Tanggal Pembelian
                </h6>
                <div class="text-body-1">
                 {{ formatTanggalIndonesia(faktur.editFaktur.tanggal_pembelian)  }}
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol> -->
      <!-- <VCol cols="12" md="6">
        <VCard class="mb-md-6 mb-3" >
          <VCardItem>
            <VRow>
              <VCol cols="12" md="6">
                <div class="d-flex flex-column gap-y-2">
                  <span class="text-subtitle-1 font-weight-medium">No. Faktur</span>
                  <span class="text-body-1">{{faktur.editFaktur.no_faktur}}</span>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="d-flex flex-column gap-y-2">
                  <span class="text-subtitle-1 font-weight-medium">No. Seri</span>
                  <span class="text-body-1">{{faktur.editFaktur.no_seri}}</span>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="d-flex flex-column gap-y-2">
                  <span class="text-subtitle-1 font-weight-medium">No. Pajak</span>
                  <span class="text-body-1">{{faktur.editFaktur.no_pajak}}</span>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="d-flex flex-column gap-y-2">
                  <span class="text-subtitle-1 font-weight-medium">Jenis Pajak</span>
                  <span class="text-body-1">{{faktur.editFaktur.jenis_pajak}}</span>
                </div>
              </VCol>
            </VRow>
          </VCardItem>
        </VCard>
      </VCol> -->

      <VCol cols="12" md="6" order-md="2" order="1">
        <!-- <VCard class="mb-md-6 mb-3" >
          <VCardItem>

          <div class="d-flex direction-row gap-3 flex-wrap justify-start" >
            <VBtn @click="$router.push(`/admin/faktur/print?id=${faktur.editFaktur._id}`)" color="success">
              Print
              <VIcon
                end
                icon="tabler-printer"
              />

            </VBtn>

            <VBtn color="primary">
              Edit
              <VIcon
                end
                icon="tabler-edit"
              />
            </VBtn>

            <VBtn color="error">
              Delete
              <VIcon
                end
                icon="tabler-trash"
              />
            </VBtn>
            <VBtn color="warning">
              Restore
              <VIcon
                end
                icon="tabler-restore"
              />
            </VBtn>
          </div>

          </VCardItem>
        </VCard> -->
        <VCard>
          <VCardTitle>
            Gambar NPWP Pembeli (saat ini)
          </VCardTitle>
          <div class="d-flex justify-center pa-4">
            <VImg :src="faktur.editFaktur.pembeli.gambar_npwp"/>
          </div>
        </VCard>
        <VCard class="mt-6">
          <VCardTitle>
            Ubah Gambar NPWP Pembeli
          </VCardTitle>
          <VCardItem>
            <VImg v-if="previewUrl" :src="previewUrl" class="mt-2" max-height="350" contain />
            <VFileInput accept="image/jpeg, image/png, image/jpg" label="Masukkan Gambar NPWP"
              @change="handleFileChange" :rules="fileRules" show-size class="mt-5" />
          </VCardItem>
        </VCard>
      </VCol>
      <VCol cols="12" md="12" order-md="3" order="3">
        <VCard class="mb-6">
          <VCardTitle>
            Daftar Barang
          </VCardTitle>
          <VCardItem>
            <!-- <VTable fixed-header class="text-no-wrap mb-4">
              <thead>
                <tr>
                  <th class="text-uppercase">
                    No.
                  </th>
                  <th class="text-uppercase">
                    Nama Barang
                  </th>
                  <th class="text-uppercase">
                    Harga
                  </th>
                  <th class="text-uppercase">
                    Qty
                  </th>
                  <th class="text-uppercase">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(barang, index) in faktur.editFaktur.barang" :key="index">
                  <td>
                    {{ index + 1 }}
                  </td>
                  <td>
                    {{ barang.nama_barang }}
                  </td>
                  <td>
                    Rp{{ formatRupiah(barang.harga) }}
                  </td>
                  <td>
                    {{ barang.qty }}
                  </td>
                  <td>
                    Rp{{ formatRupiah(barang.harga * barang.qty) }}

                  </td>
                </tr>
              </tbody>
            </VTable> -->
          </VCardItem>
          <VCardItem>
            <FakturBarangFakturEdit v-for="(barang, index) in faktur.editFaktur.barang" :key="index" :item="barang" />
          </VCardItem>

          <VCardFooter class="d-flex justify-end pa-6">
            <VBtn color="primary" @click="updateFaktur()">
              Simpan Perubahan
              <VIcon
                end
                icon="tabler-check"
              />
            </VBtn>
          </VCardFooter>
        </VCard>
      </VCol>
    </VRow>
    <!-- <FakturPrint/> -->
  </div>
</template>
