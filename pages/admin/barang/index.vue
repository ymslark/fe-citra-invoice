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
            Data Barang
          </h2>
          <VBtn class="ml-auto d-flex" color="primary" @click="navigateTo('/admin/barang/add')">
            Tambah Barang
          </VBtn>
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
      </VCardItem>
    </VCard>
    <UtilsConfirmDialog :show="isDeleteDialogVisible" title="Hapus Data" message="Apakah Anda yakin ingin menghapus barang ini?" @confirm="deleteBarang(idBarangToDelete)" @cancel="isDeleteDialogVisible = false" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAlertStore } from '@/stores/alert'


definePageMeta({
  requiresAuth: true,
})

const alertStore = useAlertStore()
const isDialogVisible = ref(false)
const isEditDialogVisible = ref(false)
const isDeleteDialogVisible = ref(false)
const errorMessage = ref('')
const idBarangToDelete = ref('')
const password = ref('')
const age = ref()
const interest = ref([])
let button = ''
let supir = {
  nama: '',
  no_telp: '',
  no_kendaraan: '',
}
const { $api } = useNuxtApp()
const barangs = ref([])
const getBarangs = async () => {
   try {
    const res = await $api.get('/barang', { limit: 90 })
    console.log(res.Barangs.docs)
    barangs.value = res.Barangs.docs
   } catch (error) {
    alertStore.showAlertObject({
      message: error.message,
      type: 'error',
    })
    console.log(error)
   }
}


function cekButton(i, button) {
  if (button == 'edit') {
    supir = supirs[i]
  }
}

const createBarang = async () => {
  try {
    const response = await $api.post('/supir', supir)
    console.log(response)
    if (!response) {
      throw { message: 'Tambah Data Gagal', code: 400 }
    }
    message
    isDialogVisible.value = false
  } catch (error) {
    errorMessage.value = error.message
    console.log(error)
  }
}
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
    await getBarangs()
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
    await getBarangs()
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
    await getBarangs()
  } catch (error) {
    alertStore.showAlertObject({
      message: error.message,
      type: 'error',
    })
    console.log(error)
  }
}
onMounted(async () => {
  // useCookie('asas', { path: '/' }).value = 'jhaskjhkjashjk'

  // console.log(useCookie('accessToken').value)
  await getBarangs()
})
</script>
