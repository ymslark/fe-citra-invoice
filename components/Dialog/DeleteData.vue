<script setup>
const { $api } = useNuxtApp()
import { useAlertStore } from '../../stores/alert'
const alert = useAlertStore()
const props = defineProps({
  // data: { type: Object },
  url: { type: String },
  // id: { type: String }
})
const isDialogVisible = ref(false)

const deleteData = (async () => {
  try {
    const response = await $api.delete(`${url}`)
    if (!response) throw {}
    isDialogVisible = false
    alert.showAlertObject({
      message: 'Berhasil Menghapus Data',
      type: 'success',
    })
  } catch (error) {
    isDialogVisible = false
    alert.showAlertObject({
      message: 'Gagal Menghapus Data',
      type: 'error',
    })
  }
})
</script>

<template>
  <VDialog v-model="isDialogVisible" width="500">
    <!-- Activator -->
    <template #activator="{ props }">
      <VBtn color="error" v-bind="props">
        <VIcon>
          tabler-trash
        </VIcon>
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Konfirmasi">
      <VCardText>
        Anda yakin ingin menghapus data ini??
      </VCardText>

      <VCardText class="d-flex justify-end">
        <VBtn color="error" @click="deleteData">
          Hapus
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
