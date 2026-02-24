<template>
  <div>
    <VCard>
      <VCardTitle>
        <div class="">
          <h2 class="text-lg font-weight-medium d-inline">
            Data Permintaan Citra Interior
          </h2>
        </div>
      </VCardTitle>
      <VCardItem>
        <VRow class="d-flex justify-end">
          <VCol cols="12" md="4">
            <AppTextField v-model="search" label="Cari Tujuan" variant="outlined"
              append-inner-icon="tabler-search" />
          </VCol>
          <VCol cols="12" md="4">
              <AppDateTimePicker
                class="mt-n1"
                v-model="dateRange"
                label="Range"
                placeholder="Pilih Rentang Tanggal"
                clearable
                :config="{ mode: 'range' }"
                />
          </VCol>
          <VCol cols="12" md="2" class="mt-md-5 ">
              <VBtn color="primary" @click="filterData(page)" class="">Filter Data</VBtn>
          </VCol>
          <VCol cols="12" class="d-flex justify-content-end flex-grow-1" >
            <div >
            </div>
            <div>

            </div>
          </VCol>
          <VCol cols="12" md="2" class="mt-4">
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
                Status
              </th>
              <th class="text-uppercase">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(surat, index) in surats" :key="index">
              <td>
                {{ index + 1 }}
              </td>
              <td>
                {{ surat.tujuan }}
              </td>
              <td>
                {{ formatTanggalIndonesia(surat.tanggal) }}
                <!-- {{ surat.tanggal }} -->
              </td>
              <td>
                <!-- <VIcon :color="status[surat.status].color">{{ status[surat.status].icon }}</VIcon> -->
                {{ surat.status }}
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
                <IconBtn size="38" @click="navigateTo(`/admin/CII/print/invoice?id=${surat._id}`)">
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
                  <VIcon @click="goToDetailPage(surat._id)">
                    tabler-info-circle</VIcon>
                </VBtn>
                <VBtn size="38" class="ml-2" icon color="warning" title="Edit">
                  <VTooltip open-on-focus location="top" activator="parent">
                    BUat Surat Penawaran
                  </VTooltip>
                  <VIcon @click="navigateTo({ name: `admin-CII-add-id`, params: { id: surat._id } })">tabler-edit
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
import { useCiStore } from '@/stores/ciis'
import {useAlertStore} from '@/stores/alert'
import { buildQueryFilterParams } from '@/utils/apiFilterQuery'


const { $api } = useNuxtApp()
const cii = useCiStore()
const alert = useAlertStore()
const currentPage = ref(1)
const surats = ref([])
const totalPages = ref(1)
const search = ref('')
const dateRange = ref('')
const filterData = async (page = 1) => {
  try {
    let start = ''
    let end = ''
    console.log(dateRange.value)
    if (dateRange.value) {
      let range = dateRange.value.split(' to ')
      console.log(range)
      if( range.length == 1) {
        start = range[0]
        end = range[0]
      }
      else if (range.length == 2) {
        start = range[0]
        end = range[1]
      }
    }
    const query = buildQueryFilterParams({ startDate: start, endDate: end,page, search: search.value, limit:20 }, false);
    const response = await $api.get('/request/CII', { ...query });
    //console.log(response)
    surats.value = response.docs
    totalPages.value = response.totalPages // backend kirim total halaman
    currentPage.value = response.page
    // console.log(surats)
  } catch (error) {
    //console.log(error.message)
    alert.showAlertObject({
      type: 'error',
      message: error.message || 'Gagal mengambil data',
    })
  }
}


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
// let surats = await cii.getCII()
// //console.log(surats)

function goToDetailPage(id) {
  navigateTo({ name: `admin-CII-request-detail-id`, params: { id } })
}

function goToEditPage(id) {
  navigateTo(`CII/edit/${id}`)
}


//fungsi untuk search data

// watch(search, (newValue) => {
//   if (newValue.length >= 3) {
//     //console.log(newValue)
//   } else if (newValue.length === 0) {
//     //console.log(newValue)
//   }
// })


await filterData(1)

</script>
