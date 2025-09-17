<template>
  <div>
  <VRow class="mb-4">
    <VCol cols="12" md="6" class="mt-md-5">
      <VCard class="text-black">
        <VCardTitle class="mb-2"> Detail Request Citra Furniture </VCardTitle>
        <VCardText class="d-flex flex-column gap-y-6">
          <div class="d-flex gap-x-3 align-center">
            <VAvatar
              variant="tonal"
              size="large"
            >
              <VIcon icon="tabler-user" />
            </VAvatar>
            <div>
              <h6 class="text-h6">
              Nama Pembeli
              </h6>
              <div class="text-body-1">
              {{ surat?.tujuan }}
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
              {{ surat?.alamat }}
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
              {{surat.no_hp}}
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
              Tanggal Request
              </h6>
              <div class="text-body-1">
              {{formatTanggalIndonesia(surat.tanggal)}}
              </div>
            </div>
          </div>
        </VCardText>
        <VCardItem>
          <VBtn color="primary" @click="navigateTo(`/admin/cf/add/${surat._id}`)">Buat Surat Penawaran <VIcon size="28">tabler-truck</VIcon>
          </VBtn>
        </VCardItem>
      </VCard>
    </VCol>
    <VCol cols="12" md="6" class="mt-md-5">
      <VCard>
        <VCardTitle>
          Daftar Barang
        </VCardTitle> 
        <VTable fixed-header class="mb-4">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Barang</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in surat?.barang" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.nama_barang }}</td>
              <td>{{ item.qty }}</td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
  </VRow>
  </div>
</template>
<script setup>
// import { router, }
import { formatTanggalIndonesia } from '@/utils/format'
const route = useRoute()
const id = route.params.id
// // console.log(id)
let surat = null
try {
  const {$api} = useNuxtApp()
  const response = await $api.get(`/Request/detail/CF/${id}`)
  surat = response.doc
  // // console.log(surat)
} catch (error) {
  
}


</script>
