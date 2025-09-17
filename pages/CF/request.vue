<template>
  <VContainer>
    <Alert />
    <VCard class="pa-3" elevation="5">
      <VCardTitle class="font-weight-bold text-wrap ml-n3">Request Form Citra Furniture</VCardTitle>
      <VForm ref="refForm" @submit.prevent>
        <VRow>
          <VCol cols="12">
            <AppTextField v-model="cf.newRequest.tujuan" label="Nama (wajib diisi)" placeholder="Nama" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12">
            <AppTextarea rows="1" v-model="cf.newRequest.alamat" label="Alamat" placeholder="Alamat (wajib diisi)" auto-grow
              :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12">
            <AppTextarea rows="1" v-model="cf.newRequest.alamat" label="Alamat" placeholder="Alamat (wajib diisi)" auto-grow
              :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="12" class="ma-0">
            <div class="d-flex justify-content-between p-0">
              <VCardTitle class="text-wrap ml-n5">Daftar Barang Request</VCardTitle>
              <VBtn color="primary" class="mr-2" rounded size="small" @click="cf.addBarangRequest"> item
                <VIcon end>tabler-plus</VIcon>
              </VBtn>
            </div>
          </VCol>
          <VCol cols="12">
            <CFAddBarangRequest v-for="(barang, index) in cf.newRequest.barang" :key="index" :barang="barang"
              :index="index" />
          </VCol>
          <VCol cols="12" class="d-flex justify-content-end">
            <VBtn color="primary" @click="submitForm">Kirim</VBtn>
          </VCol>
        </VRow>

      </VForm>
    </VCard>
  </VContainer>
</template>

<script setup>
import { useAlertStore } from '@/stores/alert'
import { useCFStore } from '@/stores/cf'
import { VForm } from 'vuetify/components/VForm'
// import { useBreakpoints } from 'vuetify';
// const breakPoint = useBreakpoints()

const { $vuetify } = useNuxtApp()
definePageMeta({
  layout: 'blank'
})
const cf = useCFStore()
const request = cf.newRequest
const refForm = ref()
const alert = useAlertStore()
// const isMobile = computed(() => breakPoint.smAndDown)
// console.log($vuetify)
// let flex = $vuetify.display.smAndDown ? 'd-flex justify-content-between p-0 flex-column' : 'd-flex justify-content-between p-0 flex-row'

const submitForm = async () => {
  try {
    // refForm?.value?.validate()
    const valid = await refForm?.value?.validate()
    if (!valid.valid) { window.scrollTo(0, 0); return }
    if (request.barang.length == 0) throw { message: 'Barang tidak boleh kosong' }

    const response = await cf.storeRequestCF()
    console.log(response)
    alert.showAlertObject({
      message: 'Berhasil Mengajukan Request',
      type: 'success',
    })
    window.scrollTo(0, 0)
    cf.resetNewRequest()
    window.location.reload()

  } catch (error) {
    window.scrollTo(0, 0)
    console.log(error)
    alert.showAlertObject({
      message: error.message || 'Gagal Mengajukan Request',
      type: 'error',
    })
    // setTimeout(() => {
    //   cf.setAlertNull()
    // }, 4000)
  }
}
</script>
