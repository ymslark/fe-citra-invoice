<template>
  <VContainer v-if="!isNotificationVisible">
    <Alert />
    <VCard class="pa-3" elevation="5">
      <VCardTitle class="font-weight-bold text-wrap ml-n3">Request Form Citra Interior</VCardTitle>
      <VForm ref="refForm" @submit.prevent>
        <VRow>
          <VCol cols="12">
            <AppTextField v-model="CII.newRequest.tujuan" label="Nama (wajib diisi)" placeholder="Nama" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12">
            <AppTextField v-model="CII.newRequest.no_hp" label="Nomor Hp (wajib diisi)" placeholder="Nomor Hp" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12">
            <AppTextarea rows="1" v-model="CII.newRequest.alamat" label="Alamat" placeholder="Alamat (wajib diisi)" auto-grow
              :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="12" class="ma-0">
            <div class="d-flex justify-content-between p-0">
              <VCardTitle class="text-wrap ml-n5">Daftar Interior Request</VCardTitle>
              <VBtn color="primary" class="mr-2" rounded size="small" @click="tambahInterior"> item
                <VIcon end>tabler-plus</VIcon>
              </VBtn>
            </div>
          </VCol>
          <VCol cols="12">
            <CIIAddInteriorRequest v-for="(interior, index) in CII.newRequest.interior" :key="interior._tempId" :interior="interior"
              :index="index" :id="`item-${index+1}` "/>
          </VCol>
          <VCol cols="12" class="d-flex justify-content-end">
            <VBtn color="primary" @click="submitForm">Kirim</VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCard>
  </VContainer>
  <UtilsNotification v-if="isNotificationVisible" @close="isNotificationVisible = false" />
</template>

<script setup>
import { useAlertStore } from '@/stores/alert'
import { useCiStore } from '@/stores/ciis'
import { VForm } from 'vuetify/components/VForm'
// import { useBreakpoints } from 'vuetify';
// const breakPoint = useBreakpoints()

const { $vuetify } = useNuxtApp()
definePageMeta({
  layout: 'blank'
})
const CII = useCiStore()
const request = CII.newRequest
const refForm = ref()
const alert = useAlertStore()
// const isMobile = computed(() => breakPoint.smAndDown)
// console.log($vuetify)
// let flex = $vuetify.display.smAndDown ? 'd-flex justify-content-between p-0 flex-column' : 'd-flex justify-content-between p-0 flex-row'

const isNotificationVisible = ref(false)
const showNotification = () => {
  isNotificationVisible.value = true
  setTimeout(() => {
    isNotificationVisible.value = false
    CII.resetNewRequest()
    // window.location.reload()

  }, 5000);

}
function scrollTo(id) {
  const el = document.getElementById(id)
  if (el){ 
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const input = el?.querySelector('[name="input-nama-interior"]')
    
    input?.focus()
    input.dispatchEvent(new Event('input', { bubbles: true }))

  }
}
const tambahInterior = () => {
  CII.addInteriorRequest()

  console.log(CII.newRequest.interior.length)
  const idItem = `item-${CII.newRequest.interior.length}`
  // scrollTo(idItem)
  setTimeout(() => {
    scrollTo(idItem)
  }, 200);
}
const submitForm = async () => {
  try {
    // refForm?.value?.validate()
    const valid = await refForm?.value?.validate()
    if (!valid.valid) { window.scrollTo(0, 0); return }
    if (request.interior.length == 0) throw { message: 'Interior tidak boleh kosong' }

    const response = await CII.storeRequestCII()
    console.log(response)
    alert.showAlertObject({
      message: 'Berhasil Mengajukan Request',
      type: 'success',
    })
    window.scrollTo(0, 0)
    showNotification()
    

  } catch (error) {
    window.scrollTo(0, 0)
    console.log(error)
    alert.showAlertObject({
      message: error.message || 'Gagal Mengajukan Request',
      type: 'error',
    })
    // setTimeout(() => {
    //   CII.setAlertNull()
    // }, 4000)
  }
}

</script>
