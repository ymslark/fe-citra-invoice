<template>
  <div>
        <!-- Edit Dialog -->
    <VDialog v-model="isEditDialogVisible" max-width="600">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isEditDialogVisible = !isEditDialogVisible" />

      <!-- Dialog Content -->
      <VCard title="Edit Data Barang">
        <VCardText>
          <VRow v-if="errorMessage">
            <VCol cols="12">
              <VAlert type="error" dismissible>
                {{ errorMessage }}
              </VAlert>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12">
              <AppTextField v-model="editBarang.nama" label="Nama Barang" placeholder="Nama Lengkap"
                :rules="[requiredValidator,]" />
            </VCol>
            <VCol cols="12">
              <AppTextField v-model="editBarang.kode" label="Kode Barang" placeholder="Kode Barang"
                :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12">
              <AppTextField v-model="editBarang.satuan" label="Satuan" placeholder="Satuan Barang"
                :rules="[requiredValidator]" />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn variant="tonal" color="secondary" @click="isEditDialogVisible = false">
            Close
          </VBtn>
          <VBtn @click="saveEditBarang(editBarang.id)">
            Save
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <VCard>
      <VCardTitle>
        <div class="">
          <h2 class="text-lg font-weight-medium d-inline">
            Data Barang Sentral Citra
          </h2>
        </div>
      </VCardTitle>
      <VCardItem>
        <VRow class="d-flex justify-end">
          <VCol cols="12" md="4">
            <AppTextField v-model="search" label="Cari Nama/Kode Barang" variant="outlined"
              append-inner-icon="tabler-search" />
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
        <!-- <div class="d-flex justify-end">
        </div> -->
        <VTable fixed-header class="text-no-wrap mb-4">
          <thead>
            <tr>
              <th class="text-uppercase">
                No.
              </th>
              <th class="text-uppercase">
                Nama Barang
              </th>
              <th class="text-uppercase">
                Kode Barang
              </th>
              <th class="text-uppercase">
                Satuan
              </th>
              <th class="text-uppercase">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(barang, index) in barangs" :key="index">
              <td>
                {{ index + 1 }}
              </td>
              <td>
                {{ barang.nama }}
              </td>
              <td>
                {{ barang.kode }}
              </td>
              <td>
                {{ barang.satuan }}
              </td>
              <td>
                <IconBtn size="38">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Detail
                  </VTooltip>
                  <VIcon>tabler-info-circle</VIcon>
                </IconBtn>
                <IconBtn size="38">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Edit
                  </VTooltip>
                  <VIcon @click="editDialog(barang._id)">tabler-edit</VIcon>
                </IconBtn>
                <IconBtn size="38">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Hapus
                  </VTooltip>
                    <VIcon @click="isDeleteDialogVisible = true; idBarangToDelete = barang._id">tabler-trash</VIcon>
                  <!-- <VIcon @click="isDeleteDialogVisible = true">tabler-trash</VIcon> -->
                </IconBtn>
              </td>
            </tr>
          </tbody>
        </VTable>
        <VRow>
            <VCol md="8" cols="12" offset-md="2">
                <VPagination v-model="currentPage" :length="totalPages" />
            </VCol>
        </VRow>
      </VCardItem>
    </VCard>
        <UtilsConfirmDialog :show="isDeleteDialogVisible" title="Hapus Data" message="Apakah Anda yakin ingin menghapus barang ini?" @confirm="deleteBarang(idBarangToDelete)" @cancel="isDeleteDialogVisible = false" />
  </div>
</template>

<script setup>

definePageMeta({
  middleware: 'client-auth',
  requiresAuth: true,
  roles: ['superadmin', 'developer'],
})
import {useAlertStore} from '@/stores/alert'
import { buildQueryFilterParams } from '@/utils/apiFilterQuery'


const { $api } = useNuxtApp()
const alert = useAlertStore()
const currentPage = ref(1)
const barangs = ref([])
const totalPages = ref(1)
const alertStore = useAlertStore()
const isDialogVisible = ref(false)
const isEditDialogVisible = ref(false)
const isDeleteDialogVisible = ref(false)
const errorMessage = ref('')
const idBarangToDelete = ref('')
const searchKode = ref('')
const dateRange = ref('st')
const filterData = async (page = 1) => {
  try {
    const query = buildQueryFilterParams({
      page,
      search: search?.value ?? '',
      limit: 25
    }, false)

    const response = await $api.get('/Barang/filterData', { ...query })

    barangs.value = response.barangs || []
    totalPages.value = response.totalPages || 1
    currentPage.value = response.page || 1
    console.log('Response:', response)
  } catch (error) {
    alert.showAlertObject({
      type: 'error',
      message: error?.message ?? 'Gagal mengambil data'
    })
  }
}

const search = ref('')
const editBarang = ref({
  id: '',
  nama: '',
  kode: '',
  satuan: '',
})

    const editDialog = async (id) => {
    try {
        const response = await $api.get(`/barang/detail/${id}`)
        console.log(response)
        if (!response) throw { message: 'Data tidak ditemukan', code: 404 }
        editBarang.value.id = response.barang._id
        editBarang.value.nama = response.barang.nama
        editBarang.value.kode = response.barang.kode
        editBarang.value.satuan = response.barang.satuan
        isEditDialogVisible.value = true
        await filterData()
    } catch (error) {
        alertStore.showAlertObject({
        message: error.message,
        type: 'error',
        })
        console.log(error)
    }
    }

    const saveEditBarang = async (id) => {
    try {
        console.log(editBarang.value)
        const response = await $api.put(`/Barang/${id}`, editBarang.value)
        console.log(response)
        if (!response) {
        throw { message: 'Ubah Data Gagal', code: 400 }
        }
        alertStore.showAlertObject({
        message: 'Data berhasil diubah',
        type: 'success',
        })
        isEditDialogVisible.value = false
        await filterData()
    } catch (error) {
        alertStore.showAlertObject({
        message: error.message,
        type: 'error',
        })
        console.log(error)
    }
    }
    const deleteBarang = async (id) => {
    try {
        const response = await $api.delete(`/Barang/${id}`)
        console.log(response)
        if (!response) {
        throw response
        }
        alertStore.showAlertObject({
        message: 'Data berhasil dihapus',
        type: 'success',
        })
        isDeleteDialogVisible.value = false
        await filterData()
    } catch (error) {
        alertStore.showAlertObject({
        message: error.message,
        type: 'error',
        })
        console.log(error)
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
onMounted( async () => {
  try {
    const query = buildQueryFilterParams({ limit:25 }, false);
    const response = await $api.get('/Barang/filterData', { ...query });
    console.log(response)
    barangs.value = response.barangs
    totalPages.value = response.totalPages || 1
    currentPage.value = response.page || 1
  } catch (error) {
    console.error('Gagal mengambil data:', error)
    alert.showAlertObject({
      type: 'error',
      message: error?.message ?? 'Gagal mengambil data'
    })
  }
})
</script>
