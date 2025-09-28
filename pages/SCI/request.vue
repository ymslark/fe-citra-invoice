<template>
  <VContainer v-if="!isNotificationVisible">
    <Alert />
    <VCard class="pa-3" elevation="5">
      <VCardTitle class="font-weight-bold text-wrap ml-n3">Request Form Sentral Citra</VCardTitle>
      <VForm ref="refForm" @submit.prevent>
        <VRow>
          <VCol cols="12">
            <AppTextField v-model="sci.newRequest.tujuan" label="Nama (wajib diisi)" placeholder="Nama" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12">
            <AppTextarea rows="1" v-model="sci.newRequest.alamat" label="Alamat" placeholder="Alamat (wajib diisi)" auto-grow
              :rules="[requiredValidator]" />
          </VCol>
          <!-- <VCol cols="12">
            <AppTextarea rows="1" v-model="sci.newRequest.alamat" label="Alamat" placeholder="Alamat (wajib diisi)" auto-grow
              :rules="[requiredValidator]" />
          </VCol> -->
          <VCol cols="12">
            <AppTextarea rows="1" v-model="sci.newRequest.no_hp" label="No Hp" placeholder="No.Hp (wajib diisi)" auto-grow
              :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="12" class="ma-0">
            <div class="d-flex justify-content-between p-0">
              <VCardTitle class="text-wrap ml-n5">Daftar Barang Request</VCardTitle>
              <VBtn color="primary" class="mr-2" rounded size="small" @click="tambahBarang"> item
                <VIcon end>tabler-plus</VIcon>
              </VBtn>
            </div>
          </VCol>
          <VCol cols="12" v-for="(barang, index) in sci.newRequest.barang" :key="index" :id="`item-${index+1}`">
            <SCIAddBarangRequest :barang="barang"
              :index="index" />
          </VCol>
          <VCol cols="12" class="d-flex justify-content-end">
            <VBtn color="primary" @click="submitForm">Kirim</VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCard>
  </VContainer>
  <UtilsNotification v-if="isNotificationVisible" />
</template>

<script setup>
import { useAlertStore } from '@/stores/alert'
import { useSCIStore } from '@/stores/sci'
import { VForm } from 'vuetify/components/VForm'
// import { useBreakpoints } from 'vuetify';
// const breakPoint = useBreakpoints()

const { $vuetify } = useNuxtApp()
definePageMeta({
  layout: 'blank'
})
const sci = useSCIStore()
const request = sci.newRequest
const refForm = ref()
const alert = useAlertStore()
// const isNotificationVisible = ref(false)
// const isMobile = computed(() => breakPoint.smAndDown)
// console.log($vuetify)
// let flex = $vuetify.display.smAndDown ? 'd-flex justify-content-between p-0 flex-column' : 'd-flex justify-content-between p-0 flex-row'

function scrollTo(id) {
  const el = document.getElementById(id)
  console.log(el)
  if (el){ 
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const input = el?.querySelector('[name="input-nama-barang"]')
    
    input?.focus()
    input.dispatchEvent(new Event('input', { bubbles: true }))

  }
}

const tambahBarang = () => {
  sci.addBarangRequest()

  console.log(sci.newRequest.barang.length)
  const idItem = `item-${sci.newRequest.barang.length}`
  console.log(idItem)
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
    if (request.barang.length == 0) throw { message: 'Barang tidak boleh kosong' }

    const response = await sci.storeRequestSCI()
    if(!response) throw {response}
    console.log(response)
    window.scrollTo(0, 0)
    alert.showAlertObject({
      message: 'Berhasil Mengajukan Request',
      type: 'success',
    })
    showNotification()
    sci.resetNewRequest()
    // window.location.reload()

  } catch (error) {
    window.scrollTo(0, 0)
    console.log(error)
    alert.showAlertObject({
      message: error.message || 'Gagal Mengajukan Request',
      type: 'error',
    })
    // setTimeout(() => {
    //   sci.setAlertNull()
    // }, 4000)
  }
}

const isNotificationVisible = ref(false)
const showNotification = () => {
  isNotificationVisible.value = true
  setTimeout(() => {
    isNotificationVisible.value = false
  }, 5000);
}
</script>
