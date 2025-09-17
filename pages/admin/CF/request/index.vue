<template>
  <div>
    <VCard>
      <VCardTitle>
        <div class="">
          <h2 class="text-lg font-weight-medium d-inline">
            Data Surat Citra Furniture
          </h2>
        </div>
      </VCardTitle>
      <VCardItem>
        <VRow>
          <VCol cols="12" offset-md="8" md="4" />
        </VRow>
        <VTable fixed-header class="text-no-wrap mb-4">
          <thead>
            <tr>
              <th class="text-uppercase">
                No.
              </th>
              <th class="text-uppercase">
                Tujuan
              </th>
              <th class="text-uppercase">
                Tanggal
              </th>
              <th class="text-uppercase">
                Status
              </th>
              <th class="text-uppercase">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(surat, index) in surats.docs" :key="index">
              <td>
                {{ index + 1 }}
              </td>
              <td>
                {{ surat.tujuan }}
              </td>
              <td>
                <!-- {{ formatTanggalIndonesia(surat.tanggal) }} -->
                {{ surat.tanggal }}
              </td>
              <td>
                {{ surat.status }}
              </td>
              <td>
                <IconBtn size="38" @click="goToDetailPage(surat._id)">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Detail
                  </VTooltip>
                  <VIcon>tabler-info-circle</VIcon>
                </IconBtn>
                <IconBtn size="38" @click="goToAddPage(surat._id)">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Buat Surat Penawaran
                  </VTooltip>
                  <VIcon>tabler-edit</VIcon>
                </IconBtn>
                <!-- <IconBtn size=" 38" @click="navigateTo(`/admin/CF/print/invoice?id=${surat._id}`)">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Hapus
                  </VTooltip>
                  <VIcon>tabler-trash</VIcon>
                </IconBtn> -->
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardItem>
    </VCard>
  </div>
</template>

<script setup>
import { useCFStore } from '@/stores/cf'
import { onMounted, ref } from 'vue'

definePageMeta({
  requiresAuth: true,
  middleware: 'auth-client',
})


const cf = useCFStore()
const isDialogVisible = ref(false)

let button = ''
let supir = {
  nama: '',
  no_telp: '',
  no_kendaraan: '',
}
let surats = await cf.getCFRequest()
// console.log(surats)

function goToDetailPage(id) {
  navigateTo(`/admin/CF/request/detail/${id}`)
}

function goToAddPage(id) {
  navigateTo(`/admin/CF/add/${id}`)
}

// function cekButton(i, button){
//   if(button == 'edit'){
//     supir = supirs[i]
//   }
// }
onMounted(async () => {
  // // console.log(useCookie('accessToken').value)
})
</script>
