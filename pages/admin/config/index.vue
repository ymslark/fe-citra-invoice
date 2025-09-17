<script  setup>

definePageMeta({
  title: 'Konfigurasi',
  middleware: ['auth'],
  roles: ['developer', 'superadmin']
})

const { $api } = useNuxtApp()
import { ScrollToTop } from '#components'
import { useAlertStore } from '@/stores/alert'
const alert = useAlertStore()
const tab = ref('rekening')
const edit = ref(false)
// const languages = ref<typeof languageList[number][]>([])
// const languages = ref(languageList[0])
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)
const perusahaanList = [
  { label: 'Citra Interior Indonesia', value: 'cii' },
  { label: 'Citra Furniture Indonesia', value: 'cf' },
  { label: 'Sentral Citra Indonesia', value: 'sci' }
]
// const config = ref()
const response = await $api.get('/getConfig')
if(!response || !response.config) {
  console.error('Failed to fetch configuration')
  alert.showAlertObject({
    type: 'error',
    message: 'Gagal mengambil konfigurasi',
  })
}
const config = ref(JSON.parse(JSON.stringify(response.config)))
const editConfig = ref(JSON.parse(JSON.stringify(response.config)))

// console.log(config)
// console.log(editConfig)
watch(edit, (val) => {
  if(val == true){
    editConfig.value = JSON.parse(JSON.stringify(response.config))
  }
})
const refForm = ref()
const updateConfig = async () => {
  try {
    // console.log(editConfig)
    const update = await $api.put('/Config', editConfig.value )
    // console.log(update)
    if (update.status) {
      window.scrollTo(0,0)
      alert.showAlertObject({
        type: 'success',
        message: 'Konfigurasi berhasil diperbarui',
      })
      edit.value = false
      config.value = JSON.parse(JSON.stringify(update.config))
      editConfig.value = JSON.parse(JSON.stringify(update.config))
    } else {
      alert.showAlertObject({
        type: 'error',
        message: 'Gagal memperbarui konfigurasi',
      })
    }
  } catch (error) {
    console.error('Error updating configuration:', error)
    alert.showAlertObject({
      type: 'error',
      message: 'Terjadi kesalahan saat memperbarui konfigurasi',
    })
  }
}



</script>

<template>
<VCard>
  <VCardTitle>
    Edit Konfigurasi
    <VBtn color="success" v-if="!edit" class="float-right" @click="edit = true"><VIcon>tabler-edit</VIcon> Edit</VBtn>
    </VCardTitle>
  <VTabs v-model="tab">
    <VTab value="rekening">
      Konfigurasi
    </VTab>
    <!-- <VTab value="ppn">
      PPN
    </VTab> -->
    <!-- <VTab value="social-links">
      Social Links
    </VTab> -->
  </VTabs>

  <VCard flat>
    <VCardText>
      <VWindow
        v-model="tab"
        class="disable-tab-transition"
      >
        <VWindowItem value="rekening">
          <div v-if="!edit">
            <VCard class="mb-2" v-for="(perusahaan,i) in perusahaanList" :key="i" >
              <VCardTitle>{{perusahaan.label}}</VCardTitle>
              <VCardText>
                <VRow v-for="(item, index) in config.rekening[perusahaan.value]" :key="index">
                  <VCol cols="12" md="6">
                    <AppTextField 
                      v-model="config.rekening[perusahaan.value][index].atas_nama"
                      label="Nama Rekening"
                      placeholder="Masukkan Nama Rekening" readonly/>
                  </VCol>
                  <VCol cols="12" md="4">
                    <AppTextField 
                      v-model="config.rekening[perusahaan.value][index].no_rekening"
                      label="Nomor Rekening"
                      placeholder="Masukkan Nomor Rekening" readonly/>
                  </VCol>
                  <VCol cols="12" md="2">
                    <AppTextField 
                      v-model="config.rekening[perusahaan.value][index].nama_bank"
                      label="Bank"
                      placeholder="Masukkan Bank" readonly/>
                  </VCol>
                  <VDivider/>
                </VRow>
              </VCardText>
            </VCard>
            <VCard class="mb-2">
              <VCardTitle>PPN</VCardTitle>
              <VCardText>
                <VRow>
                  <VCol cols="12" md="6">
                    <AppTextField 
                      v-model="config.ppn"
                      label="PPN"
                      placeholder="Masukkan PPN%" readonly/>
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </div>
          <div v-if="edit">
            <VForm VForm class="mt-2" ref="refForm">
              <VCard class="mb-2" v-for="(perusahaan,i) in perusahaanList" :key="i" >
                <VCardTitle>{{perusahaan.label}}</VCardTitle>
                <VCardText>
                  <VRow v-for="(item, index) in editConfig.rekening[perusahaan.value]" :key="index">
                    <VCol cols="12" md="6">
                      <AppTextField 
                        v-model="editConfig.rekening[perusahaan.value][index].atas_nama"
                        label="Nama Rekening"
                        placeholder="Masukkan Nama Rekening"/>
                    </VCol>
                    <VCol cols="12" md="4">
                      <AppTextField 
                        v-model="editConfig.rekening[perusahaan.value][index].no_rekening"
                        label="Nomor Rekening"
                        placeholder="Masukkan Nomor Rekening"/>
                    </VCol>
                    <VCol cols="12" md="2">
                      <AppTextField 
                        v-model="editConfig.rekening[perusahaan.value][index].nama_bank"
                        label="Bank"
                        placeholder="Masukkan Bank"/>
                    </VCol>
                    <VDivider/>
                  </VRow>
                </VCardText>
              </VCard>
              <VCard class="mb-2">
                <VCardTitle>PPN</VCardTitle>
                <VCardText>
                  <VRow>
                    <VCol cols="12" md="6">
                      <AppTextField 
                        v-model="editConfig.ppn"
                        label="PPN"
                        placeholder="Masukkan PPN%"/>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
              <VCardText class="d-flex gap-4" v-if="edit">
                <VBtn @click="updateConfig">Update</VBtn>
                <VBtn
                  color="secondary"
                  variant="tonal"
                  @click="edit = !edit"
                >
                  Cancel
                </VBtn>
              </VCardText>
            </VForm>  
          </div>
        </VWindowItem>
      </VWindow>
    </VCardText>

  </VCard>
</VCard>
</template>
