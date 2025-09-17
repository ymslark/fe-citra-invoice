<template>
  <div>
    <VCard>
      <VCardTitle>
        <div class="">
          <h2 class="text-lg font-weight-medium d-inline">
            Data Surat Citra Interior
          </h2>
        </div>
      </VCardTitle>
      <VCardItem>
        <VRow>
          <!-- <VCol cols="12" md="4" class="d-flex align-center">
            <AppTextField v-model="search" label="Cari Tujuan" variant="outlined" class="mb-4" clearable
              append-inner-icon="tabler-search" @keyup.enter="fetchItems()" />
          </VCol> -->
          <!-- <VCol cols="12" md="4" offset-md="6">
              <AppDateTimePicker
                v-model="dateRange"
                label="Range"
                placeholder="Select date"
                :config="{ mode: 'range' }"
                />
          </VCol> -->
          <VCol cols="12" md="2" class="d-flex align-end">
              <VBtn color="primary" @click="getDocumentByRange" class="">Filter Tanggal</VBtn>
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
                No.Seri
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
                {{ surat.no_seri }}
              </td>
              <td>
                {{ surat.tujuan }}
              </td>
              <td>
                {{ formatTanggalIndonesia(surat.tanggal) }}
              </td>
              <td>
                <VIcon :color="status[surat.status].color">{{ status[surat.status].icon }}</VIcon>
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
                    Edit
                  </VTooltip>
                  <VIcon @click="navigateTo({ name: `admin-CII-edit-id`, params: { id: surat._id } })">tabler-edit
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
  // middleware: 'auth.client',
  requiresAuth: true,
})
import { useCiStore } from '@/stores/ciis'
import {useAlertStore} from '@/stores/alert'


const { $api } = useNuxtApp()
const cii = useCiStore()
const alert = useAlertStore()
const currentPage = ref(1)
const surats = ref([])
const totalPages = ref(1)

// Ambil data dari backend, backend sudah siapkan pagination
const fetchItems = async (page = 1) => {
  try {
    const response = await $api.get(`/CII?page=${page}&limit=20`)
    console.log(response)
    surats.value = response.docs
    totalPages.value = response.totalPages // backend kirim total halaman
  } catch (error) {
    console.error('Gagal mengambil data:', error)
  }
}

watch(currentPage, (page) => {
  if (search.value.length >= 3) {
    getDocumentByRange(page)
  }
  else if (search.value.length === 0) {
    getDocumentByRange(page)
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
// console.log(surats)

function goToDetailPage(id) {
  navigateTo({ name: `admin-CII-detail-id`, params: { id } })
}

function goToEditPage(id) {
  navigateTo(`CII/edit/${id}`)
}

const search = ref('')

//fungsi untuk search data

watch(search, (newValue) => {
  if (newValue.length >= 3) {
    getDocumentByRange()
  } else if (newValue.length === 0) {
    getDocumentByRange()
  }
})

const dateRange = ref()

const getDocumentByRange = async (page) => {
  try {
    let start = ''
    let end = ''
    if (!dateRange.value) throw { message: 'Pilih rentang tanggal terlebih dahulu' }
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
    const response = await cii.getCIIByPeriods(start, end, page, search.value)
    console.log(response)
    surats.value = response.docs
    totalPages.value = response.totalPages // backend kirim total halaman
    // currentPage.value = page || 1
    console.log(surats.value)
  } catch (error) {
    console.log(error.message)
    alert.showAlertObject({
      type: 'error',
      message: error.message || 'Gagal mengambil data',
    })
  }
}
</script>
