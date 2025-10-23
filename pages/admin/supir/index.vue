<template>
  <div>
    <!-- Add Dialog -->
    <VDialog v-model="isDialogVisible" max-width="600">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

      <!-- Dialog Content -->
      <VCard title="Tambah Supir">
        <VCardText>
          <VForm>
            <VRow>
              <VCol cols="12">
                <AppTextField v-model="driver_name" label="Nama" placeholder="Nama Lengkap" />
              </VCol>
              <VCol cols="12">
                <AppTextField v-model="driver_phone" label="Nomor Telepon" placeholder="Nomor Telepon" />
              </VCol>
              <VCol cols="12">
                <AppTextField v-model="vehicle_number" label="Nomor Kendaraan" placeholder="Nomor Kendaraan" />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn variant="tonal" color="secondary" @click="isDialogVisible = false">
            Close
          </VBtn>
          <VBtn @click="createSupir">
            Save
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Edit Dialog -->
    <VDialog v-model="isEditDialogVisible" max-width="600">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isEditDialogVisible = !isEditDialogVisible" />

      <!-- Dialog Content -->
      <VCard title="Edit Data Supir">
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
              <AppTextField v-model="editSupir.driver_name" label="Nama" placeholder="Nama Lengkap"
                :rules="[requiredValidator,]" />
            </VCol>
            <VCol cols="12">
              <AppTextField v-model="editSupir.driver_phone" label="Nomor Telepon" placeholder="Nomor Telepon"
                :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12">
              <AppTextField v-model="editSupir.vehicle_number" label="Nomor Kendaraan" placeholder="Nomor Kendaraan"
                :rules="[requiredValidator]" />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn variant="tonal" color="secondary" @click="isEditDialogVisible = false">
            Close
          </VBtn>
          <VBtn @click="saveEditSupir">
            Save
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <VCard>
      <VCardTitle>
        <div class="">
          <h2 class="text-lg font-weight-medium d-inline">
            Data Supir
          </h2>
          <!-- <template #activator="{ props }"> -->
          <VBtn class="ml-auto d-flex" color="primary" @click="isDialogVisible = true">
            Tambah Supir
          </VBtn>
          <!-- </template> -->
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
                Nama Supir
              </th>
              <th class="text-uppercase">
                Nomor Telepon
              </th>
              <th class="text-uppercase">
                Nomor Kendaraan
              </th>
              <th class="text-uppercase">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(supir, index) in supirs" :key="index">
              <td>
                {{ index + 1 }}
              </td>
              <td>
                {{ supir.nama_supir }}
              </td>
              <td>
                {{ supir.no_hp }}
              </td>
              <td>
                {{ supir.no_kendaraan }}
              </td>
              <td>
                <IconBtn size="38" @click="navigateTo(`/admin/supir/detail/${supir._id}`)">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Detail
                  </VTooltip>
                  <VIcon>tabler-info-circle</VIcon>
                </IconBtn>
                <IconBtn size="38">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Edit
                  </VTooltip>
                  <VIcon @click="editDialog(supir._id)">tabler-edit</VIcon>
                </IconBtn>
                <!-- <IconBtn size="38">
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
import { useAlertStore } from '@/stores/alert'
import { onMounted, ref } from 'vue'
definePageMeta({
  requiresAuth: true,
})
const alertStore = useAlertStore()

const isDialogVisible = ref(false)
const isEditDialogVisible = ref(false)
const errorMessage = ref('')
const middleName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const age = ref()
const interest = ref([])
let button = ''
let driver_name = ref('')
let driver_phone = ref('')
let vehicle_number = ref('')

const { $api } = useNuxtApp()
// const response = await $api.get('/supir')
// let allDriver = response.Supirs
const supirs = ref([])

const getSupir = async () => {
  try {
    const response = await $api.get('/supir')
    console.log(response)
    supirs.value = response.supir
    console.log(supirs.value)

  } catch (error) {

    console.log(error)
  }
}

getSupir()


// function goToDetailPage(id) {
//   navigateTo(`supir-detail-${id}`)
// }

// function cekButton(i, button) {
//   if (button == 'edit') {
//     supir = supirs[i]
//   }
// }

const createSupir = async () => {
  try {
    const supir = {
      driver_name: driver_name.value,
      driver_phone: driver_phone.value,
      vehicle_number: vehicle_number.value,
    }
    const response = await $api.post('/supir', supir)
    console.log(response)
    alertStore.showAlertObject({
      message: 'Data Supir berhasil ditambah!',
      type: 'success',
    })
    getSupir()
    isDialogVisible.value = false

  } catch (error) {
    alertStore.showAlertObject({
      message: error.message,
      type: 'error',
    })
    // errorMessage.value = error.message
    console.log(error)
  }
}
let dataEditSUpir = {
  id: '',
  driver_name: '',
  driver_phone: '',
  vehicle_number: '',
}
const editSupir = ref(dataEditSUpir)

const editDialog = async (id) => {
  try {
    const response = await $api.get(`/supir/detail/${id}`)
    // console.log(response)
    console.log(editSupir)
    // if (!response) throw { message: 'Data tidak ditemukan', code: 404 }
    editSupir.value.id = response.supir._id
    editSupir.value.driver_name = response.supir.nama_supir
    editSupir.value.driver_phone = response.supir.no_hp
    editSupir.value.vehicle_number = response.supir.no_kendaraan
    isEditDialogVisible.value = true
  } catch (error) {
    alertStore.showAlert({
      message: error.message,
      type: 'error',
    })
    console.log(error)
  }
}

const saveEditSupir = async () => {
  try {
    console.log(editSupir)
    const response = await $api.put(`/supir/${editSupir.id}`, editSupir)
    console.log(response)
    if (!response) {
      throw { message: 'Ubah Data Gagal', code: 400 }
    }
    isEditDialogVisible.value = false
  } catch (error) {
    errorMessage.value = error.message
    console.log(error)
  }
}
onMounted(() => {
  useCookie('asas', { path: '/' }).value = 'jhaskjhkjashjk'

  // console.log(useCookie('accessToken').value)
})
</script>
