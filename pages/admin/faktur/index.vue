
<template>
  <div>
    <VCard>
      <VCardTitle>
        <div class="">
          <h2 class="text-lg font-weight-medium d-inline">
            Data Permintaan Faktur Pajak
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
                Pembeli
              </th>
              <th class="text-uppercase">
                Tanggal Pengajuan
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
                {{ surat.pembeli.nama_pembeli }}
              </td>
              <td>
                {{ formatTanggalIndonesia(surat.tanggal) }}
              </td>
              <td>
                <VIcon :color="status[surat.status].color">{{ status[surat.status].icon }}</VIcon>
                {{ surat.status }}
              </td>

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
                  <VIcon @click="navigateTo({ name: `admin-faktur-edit-id`, params: { id: surat._id } })">tabler-edit
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
  // requiresAuth: true,
  // roles: ['admin', 'superadmin'],
})
import { useFakturStore } from '@/stores/faktur'
import { buildQueryFilterParams } from '@/utils/apiFilterQuery'

const { $api } = useNuxtApp()
const faktur = useFakturStore()

const currentPage = ref(1)
const surats = ref([])
const totalPages = ref(1)


// Ambil data dari backend, backend sudah siapkan pagination
const fetchItems = async (page = 1) => {
  try {
    const response = await $api.get(`/Faktur?page=${page}`)
    console.log(response)
    surats.value = response.fakturs.docs
    totalPages.value = response.fakturs.totalPages // backend kirim total halaman
    console.log(surats.value)
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
// let surats = await faktur.getFaktur()
// console.log(surats)

function goToDetailPage(id) {
  navigateTo({ name: `admin-faktur-detail-id`, params: { id } })
}

function goToEditPage(id) {
  navigateTo(`Faktur/edit/${id}`)
}

const search = ref('')

//fungsi untuk search data
const searchData = async (page) => {
  try {
    const response = await $api.get(`/Faktur/search?keyword=${search.value}&&page=${page}&limit=10`)
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

const fetchIndexFaktur = async () => {
  const {$api} = useNuxtApp()
  const query = buildQueryFilterParams({}, true); // defaultLast30Days = true
  const res = await $api.get("/faktur/filterData", { params: query });
  surats.value = res.docs;
  totalPages.value = res.totalPages;
  currentPage.value = res.page;
}

</script>
