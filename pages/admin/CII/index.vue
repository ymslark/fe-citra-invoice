<template>
  <div>
    <VCard>
      <VCardTitle>
        <div class="">
          <h2 class="text-lg font-weight-medium d-inline">
            Data Surat Citra Interior 30 Hari Terakhir
          </h2>
        </div>
      </VCardTitle>
      <VCardItem>
        <VRow>
          <VCol cols="12" offset-md="8" md="4" class="d-flex justify-end">
            <AppTextField v-model="search" label="Cari Tujuan" variant="outlined" class="mb-4" clearable
              append-inner-icon="tabler-search" @keyup.enter="fetchItems()" />
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
import {buildQueryFilterParams} from '@/utils/apiFilterQuery'

const { $api } = useNuxtApp()
const cii = useCiStore()

const currentPage = ref(1)
const surats = ref([])
const totalPages = ref(1)
const search = ref('')

// Ambil data dari backend, backend sudah siapkan pagination
const fetchItems = async (page = 1) => {
  try {
    const query = buildQueryFilterParams({ limit:10, page, search: search.value}, true); // defaultLast30Days = true
    const res = await $api.get("/CII/filterData", { ...query });

    surats.value = res.docs;
    totalPages.value = res.totalPages;
    currentPage.value = res.page;
    suratsFiltered.value = surats;
  } catch (error) {
    console.error('Gagal mengambil data:', error)
  }
}

watch(currentPage, (page) => {
  if (search.value.length >= 3) {
    searchData(page)
  }
  else if (search.value.length === 0) {
    fetchItems(page)
  }
  // fetchItems(page)
})

fetchItems(currentPage.value)


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


//fungsi untuk search data
const searchData = async (page) => {
  try {
    const response = await $api.get(`/CII/search?keyword=${search.value}&&page=${page}&limit=10`)
    console.log(response)
    surats.value = response.docs
    totalPages.value = response.totalPages // backend kirim total halaman
  } catch (error) {
    console.error('Gagal mengambil data:', error)
  }
}

watch(search, (newValue) => {
  if (newValue.length >= 3) {
    searchData()
  } else if (newValue.length === 0) {
    fetchItems(1)
  }
})


// function cekButton(i, button){
//   if(button == 'edit'){
//     supir = supirs[i]
//   }
// }
// onMounted(async () => {
//   // console.log(useCookie('accessToken').value)
// })
</script>
