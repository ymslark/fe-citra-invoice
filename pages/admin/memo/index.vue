<template>
  <div>
    <VCard>
      <VCardTitle>
        <div class="">
          <h2 class="text-lg font-weight-medium d-inline">
            Data Surat Jalan 30 Hari Terakhir
          </h2>
        </div>
      </VCardTitle>
      <VCardItem>
        <VRow class="d-flex justify-end">
          <VCol cols="12" md="4">
            <AppTextField v-model="search" label="Cari Tujuan" variant="outlined"
              append-inner-icon="tabler-search" @keyup.enter="filterData(1)"/>
          </VCol>
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
                Nama Supir
              </th>
              <th class="text-uppercase">
                Perusahaan
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
            <tr v-for="(memo, index) in memos" :key="index">
              <td>
                {{ index + 1 }}
              </td>
              <td>
                {{ memo.tujuan }}
              </td>
              <td>
                {{ formatTanggalIndonesia(memo.tanggal) }}
              </td>
              <td>
                {{ memo.supir.nama_supir }}
              </td>
              <td>
                {{ memo.perusahaan }}
              </td>
              <td>
                <VIcon :color="status[memo.status].color">{{ status[memo.status].icon }}</VIcon>
                {{ memo.status }}
              </td>
              <!-- <td>
                <IconBtn size="38" @click="goToDetailPage(surat._id)">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Detail
                  </VTooltip>
                  <VIcon>tabler-info-circle</VIcon>
                </IconBtn>
                <IconBtn size="38" @click="goToEditPage(surat._id)">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Edit
                  </VTooltip>
                  <VIcon>tabler-edit</VIcon>
                </IconBtn>
                <IconBtn size="38" @click="navigateTo(`/admin/SCI/print/invoice?id=${surat._id}`)">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Hapus
                  </VTooltip>
                  <VIcon>tabler-trash</VIcon>
                </IconBtn>
              </td> -->
              <td>
                <VBtn size="38" icon color="primary" title="Detail">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Detail
                  </VTooltip>
                  <VIcon @click="goToDetailPage(memo._id)">
                    tabler-info-circle</VIcon>
                </VBtn>
                <VBtn size="38" class="ml-2" icon color="warning" title="Edit">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Edit
                  </VTooltip>
                  <VIcon @click="navigateTo({ name: `admin-memo-edit-id`, params: { id: memo._id } })">tabler-edit
                  </VIcon>
                </VBtn>
                <!-- <VBtn size="38" class="ml-2" icon color="error" title="Hapus">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Hapus
                  </VTooltip>
                  <VIcon>tabler-trash</VIcon>
                </VBtn> -->
              </td>
            </tr>
          </tbody>
        </VTable>
        <!-- <div class="d-flex justify-end">
        </div> -->
        <VPagination v-model="currentPage" :length="totalPages" />
      </VCardItem>
    </VCard>
  </div>
</template>

<script setup>

definePageMeta({
  middleware: 'auth-client',
  requiresAuth: true,
})
import { useMemoStore } from '@/stores/memo'
import {useAlertStore} from '@/stores/alert'
import { buildQueryFilterParams } from '@/utils/apiFilterQuery'


const { $api } = useNuxtApp()
const memo = useMemoStore()
const alert = useAlertStore()
const currentPage = ref(1)
const memos = ref([])
const totalPages = ref(1)

const filterData = async (page = 1) => {
  try {

    const query = buildQueryFilterParams({ page, search: search.value, limit:30 }, true);
    const response = await $api.get('/Memo', { ...query });
    console.log(response)
    memos.value = response.docs
    totalPages.value = response.totalPages // backend kirim total halaman
    currentPage.value = response.page
    //console.log(memos.value)
  } catch (error) {
    //console.log(error.message)
    alert.showAlertObject({
      type: 'error',
      message: error.message || 'Gagal mengambil data',
    })
  }
}

// Ambil data dari backend, backend sudah siapkan pagination
// const fetchItems = async (page = 1) => {
//   try {
//     const response = await $api.get(`/SCI?page=${page}&limit=10`)
//     //console.log(response)
//     memos.value = response.docs
//     totalPages.value = response.totalPages // backend kirim total halaman
//   } catch (error) {
//     console.error('Gagal mengambil data:', error)
//   }
// }

watch(currentPage, (page) => {
  if (search.value.length >= 3) {
    filterData(page)
  }
  else if (search.value.length === 0) {
    //console.log(page)
    filterData(page)
  }

})



let smallPagination = ref(3)
let supir = {
  nama: '',
  no_telp: '',
  no_kendaraan: '',
}
let status = {
  'WAITING': {
    icon: 'tabler-hourglass',
    color: 'warning'
  },
  'PROCCESS': {
    icon: 'tabler-truck-delivery',
    color: 'primary'
  },
  'DONE': {
    icon: 'tabler-check',
    color: 'success'
  },
  'CANCEL': {
    icon: 'tabler-x',
    color: 'error'
  }
}
// let memos = await sci.getSCI()
// //console.log(memos)

function goToDetailPage(id) {
  navigateTo({ name: `admin-memo-detail-id`, params: { id } })
}

function goToEditPage(id) {
  navigateTo(`memo/edit/${id}`)
}

const search = ref('')

//fungsi untuk search data

// watch(search, (newValue) => {
//   if (newValue.length >= 3) {
//     //console.log(newValue)
//   } else if (newValue.length === 0) {
//     //console.log(newValue)
//   }
// })



// const getDocumentByRange = async (page) => {
//   try {
//     let start = ''
//     let end = ''
//     if (!dateRange.value) throw { message: 'Pilih rentang tanggal terlebih dahulu' }
//     let range = dateRange.value.split(' to ')
//     //console.log(range)
//     if( range.length == 1) {
//       start = range[0]
//       end = range[0]
//     }
//     else if (range.length == 2) {
//       start = range[0]
//       end = range[1]
//     }
//     const response = await sci.getSCIByPeriods(start, end, page, search.value)
//     //console.log(response)
//     surats.value = response.docs
//     totalPages.value = response.totalPages // backend kirim total halaman
//     // currentPage.value = page || 1
//     //console.log(surats.value)
//   } catch (error) {
//     //console.log(error.message)
//     alert.showAlertObject({
//       type: 'error',
//       message: error.message || 'Gagal mengambil data',
//     })
//   }
// }
filterData(1)
</script>
