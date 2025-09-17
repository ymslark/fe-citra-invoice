<template>
  <div>
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
                <!-- <IconBtn size="38">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Edit
                  </VTooltip>
                  <VIcon @click="editDialog(barang._id)">tabler-edit</VIcon>
                </IconBtn> -->
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
import { onMounted, ref } from 'vue'

definePageMeta({
  requiresAuth: true,
})

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
let supir = {
  nama: '',
  no_telp: '',
  no_kendaraan: '',
}
const { $api } = useNuxtApp()

const response = await $api.get('/supir',)
const supirs = response.Supirs
function goToDetailPage(id) {
  navigateTo(`supir/detail/${id}`)
}

const barangs = ref([])
const res = await $api.get('/barang', { limit: 90 })
console.log(res.Barangs.docs)
barangs.value = res.Barangs.docs
function cekButton(i, button) {
  if (button == 'edit') {
    supir = supirs[i]
  }
}

const createSupir = async () => {
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
let editSupir = {
  id: '',
  driver_name: '',
  driver_phone: '',
  vehicle_number: '',
}

const editDialog = async (id) => {
  try {
    const response = await $api.get(`/supir/detail/${id}`)
    console.log(response)
    if (!response) throw { message: 'Data tidak ditemukan', code: 404 }
    editSupir.id = response.supir._id
    editSupir.driver_name = response.supir.nama_supir
    editSupir.driver_phone = response.supir.no_hp
    editSupir.vehicle_number = response.supir.no_kendaraan
    isEditDialogVisible.value = true
  } catch (error) {
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
  // useCookie('asas', { path: '/' }).value = 'jhaskjhkjashjk'

  // console.log(useCookie('accessToken').value)
})
</script>
