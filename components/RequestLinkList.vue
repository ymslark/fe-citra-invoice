<script setup>
import { useAuthStore } from '@/@core/stores/auth.js'
import { link } from '@/views/demos/components/button/demoCodeButton'
import is from '@sindresorhus/is'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VTable } from 'vuetify/components'
// import logoutGif from '@images/pages/log-out-1.gif'

// const ability = useAbility()

// TODO: Get type from backend
const authStore = useAuthStore()
const userData = authStore.user
const snackbarValue = ref('')
const config = useRuntimeConfig()
let requestLink = [
  { title: 'Citra Interior Indonesia', link: `CII` , icon:'tabler-copy'},
  { title: 'Citra Furniture Indonesia', link: `CF`, icon:'tabler-copy' },
  { title: 'Sentral Citra Indonesia', link: `SCI`, icon:'tabler-copy' },
  { title: 'Faktur', link: `Faktur` , icon:'tabler-copy'},

]
const isDialogVisible = ref(false)
const isSnackbarVisible = ref(false)

// const { signOut } = useAuth()
async function copyLink(index) {
  try {
    // console.log('copy link index:', index)
    let link = `${config.public.appBaseUrl}/${requestLink[index].link}/request`
    // console.log('link:', link)
    await navigator.clipboard.writeText(link)
    requestLink[index]['icon'] = 'tabler-check'
    snackbarValue.value = `Link Form Request ${requestLink[index].title} berhasil disalin ke clipboard`
    isSnackbarVisible.value = true
    setTimeout(() => {
      requestLink[index]['icon'] = 'tabler-copy'
    }, 2000)
    // Show success message or toast notification
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}



</script>

<template>
  
  <VAvatar size="38" class="cursor-pointer" :color="primary" :variant="tonal" @click="isDialogVisible = !isDialogVisible">
    <VIcon icon="tabler-link" />
    <VTooltip open-on-focus location="bottom" activator="parent" >
      Request Link
    </VTooltip>
  </VAvatar>
  <VDialog
      v-model="isDialogVisible"
      persistent
      class="v-dialog-sm"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

      <!-- Dialog Content -->
      <VCard title="Salin Link Request" class="text-center">

        <!-- <VListItem
          v-for="(item, index) in userProfileList"
          :key="index"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          color="primary"
          @click="isDialogVisible = false"
        />  -->
          <!-- <VList>
            <VListItem><VBtn @click="isDialogVisible = !isDialogVisible">fdadf</VBtn></VListItem>
          </VList> -->
        <VTable >
          <thead>
            <tr v-for="(item, index) in requestLink" :key="index">
              <th class="text-center">{{ item.title }}</th>
              <th><VBtn variant="outlined" size="small" @click="copyLink(index)"><VIcon :icon="item.icon" /></VBtn> <VTooltip>
                Salin Link
              </VTooltip></th>
            </tr>
          </thead>
        </VTable>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <!-- <VBtn
            color="secondary"
            variant="tonal"
            @click="isDialogVisible = false"
          >
           selesai
          </VBtn> -->
          <VBtn @click="isDialogVisible = false" color="success">
            selesai
          </VBtn>
        </VCardText>
      </VCard>
  </VDialog>
  <!-- Dialog --> 
    <VSnackbar
    v-model="isSnackbarVisible"
    :timeout="2000" location="center"
  >
    {{snackbarValue}}
  </VSnackbar>
</template>
