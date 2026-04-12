<script setup>
definePageMeta({
  middleware: 'auth-client',
  requiresAuth: true,
  roles: ['superadmin', 'developer'],
})
import { useAlertStore } from '@/stores/alert';
import { useBarangStore } from '@/stores/barang';
import { VForm } from 'vuetify/components/VForm'
import {ref} from 'vue'
import * as XLSX from 'xlsx'
const { t } = useI18n()

let barang = useBarangStore()
let alert = useAlertStore()
let addedBarang = barang.addedBarang
const refForm = ref(null)
const addBarang = () => barang.addBarang()
const selectedFile = ref(null)
const isLoading = ref(false)
await barang.getAllBarang()

const showDialog = ref(false)
const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}
// const handleUpload = async () => {
//   // console.log('File upload triggered', selectedFile.value)
//   isLoading.value = true
//   const file = selectedFile.value
//   if (!selectedFile.value) return
  
//   const reader = new FileReader()
    
//   reader.onload = (e) => {
//     const data = new Uint8Array(e.target.result)
//     const workbook = XLSX.read(data, { type: 'array' })
//     const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
//     const jsonData = XLSX.utils.sheet_to_json(firstSheet)
    
//     // Simpan ke Pinia
//     barang.setBarangFromExcel(jsonData)
//     // console.log('Data masuk ke state:', barang.addedBarang)
//   }
  
//   reader.readAsArrayBuffer(file)
//   await nextTick()
//   isLoading.value = false
// }

const handleUpload = async () => {
  if (!selectedFile.value) return
  
  isLoading.value = true
  
  // Bungkus reader pake Promise
  const jsonData = await new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
      resolve(jsonData)
    }
    reader.readAsArrayBuffer(selectedFile.value)
  })
  
  // Simpan ke store
  barang.setBarangFromExcel(jsonData)
  
  // Tunggu render selesai
  await nextTick()
  
  // Matikan loading
  setTimeout(() => {
  isLoading.value = false
  }, 3000) // Tambahkan delay kecil untuk memastikan UI update
}
const resetBarang = () => {
  isLoading.value = true
  barang.resetAddedBarang()
  addedBarang.value = barang.addedBarang
  setTimeout(() => {
    isLoading.value = false
  }, 2000) // Tambahkan delay kecil untuk memastikan UI update
}
const saveBarang = async () => {
  try {
    const valid = await refForm?.value?.validate()
    if (!valid.valid) { window.scrollTo(0, 0); return }
    console.log(valid)
    const response = await barang.storeBarang()
    console.log(response)
    barang.resetAddedBarang()

    // console.log(response)
    alert.showAlert('success', 'Data berhasil disimpan')
  } catch (error) {
    console.log(error)
    let message = error.message
    if (error.message === 'KODE_BARANG_ALREADY_EXIST') {
      barang.existingKode = error.existingKode
      message = `${t(error.message)}, (${error.existingKode})`
      // const valid = await refForm?.value?.validate()
      // console.log(valid)
      // if (!valid.valid) { window.scrollTo(0, 0); return }
      //       // Set error langsung ke form
      // refForm?.value?.setErrors([{
      //   path: `[${index}].kode_barang`,
      //   message: 'Kode barang sudah ada'
      // }])
      
      // refForm?.value?.validate()
    }
    console.log('Existing Kode:', barang.existingKode)
    alert.showAlert('error', t(message))
  }
  const fileRules = [
    () => !!file.value || 'File wajib diisi',
    () => ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(file.value.type) || 'Harus file Excel',
    () => file.value.size < 1000000 || 'ukuran file maksimal 1MB',
  ]
  
  watch(barang.addedBarang, (newBarang) => {
    if (newBarang) {
      addedBarang.value = newBarang
    }
  })

}

</script>
<template>
  <div>
    <VCard class="mt-4">
      <VCardTitle>
        <div class="d-flex gap-2 justify-space-between">
          <div class="text-h5">
            Daftar Barang 
          </div>
          <div class="d-flex gap-2">
            <VBtn color="primary" @click="addBarang" size="small">
              Add
            </VBtn>
            <VBtn color="error" @click="resetBarang" size="small">
              Reset
            </VBtn>
          </div>  
        </div>
      </VCardTitle>
      <!-- <VSpacer /> -->
      <VCardItem>
          <VForm ref="refForm" @submit.prevent>
            <VRow class="mt-2">
              <VCol cols="12" md="6">
                <VFileInput label="Upload Excel" accept=".xlsx, .xls" :rules="fileRules" @change="handleFileChange" />
              </VCol>
              <VCol cols="12" md="6">
                <div class="d-flex gap-2">
                  <VBtn color="primary" @click="handleUpload">
                    Upload
                    <VIcon end icon="tabler-cloud-upload"/>
                  </VBtn>
                  <VTooltip location="top" 
                  open-on-click
                  :open-on-hover="false">
                  <template #activator="{ props }">
                    <VBtn color="primary" variant="outlined" v-bind="props">
                      petunjuk
                      <VIcon end icon="tabler-info-circle"/>
                    </VBtn>
                    </template>
                    <span>Maksimal 50 barang</span>
                  </VTooltip>

                </div>
              </VCol>
              <VCol cols="12" md="6" v-if="isLoading">
                <VProgressLinear
                  indeterminate
                  color="primary"
                />
              </VCol>
              <div class="mb-4">
              </div>
            </VRow>
            <div v-if="isLoading === false">
              <BarangAddBarang v-for="(barang, index) in barang.addedBarang" :key="barang" :barang="barang" :index="index" />
            </div>
          </VForm>
      </VCardItem>
      <VCardItem>
        <VBtn color="primary" @click="saveBarang">
          Save
        </VBtn>
      </VCardItem>
    </VCard>
    <UtilsConfirmDialog :show="showDialog" title="Konfirmasi Reset" message="Apakah Anda yakin ingin mereset semua data barang yang telah ditambahkan?" @confirm="resetBarang" @cancel="showDialog = false" />
    <!-- <UtilsConfirmDialog :show="showDialog" title="Konfirmasi Reset" message="Apakah Anda yakin ingin mereset semua data barang yang telah ditambahkan?" @confirm="resetBarang; showDialog.value = false" @cancel="showDialog.value = false" /> -->
  </div>
</template>

<style scoped>
.scroller {
  height: 100%;
  max-height: 600px;
}
</style>