<script setup>
const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Konfirmasi' },
  message: { type: String, default: 'Anda Yakin ?' },
})

const showDialog = ref(true)
defineEmits(['confirm', 'cancel'])
</script>

<template>

  <VDialog v-if="show" v-model="showDialog" persistent class="v-dialog-sm">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="$emit('cancel')" />

    <!-- Dialog Content -->
    <VCard :title="title">
      <VCardText>
        {{ message }}
      </VCardText>

      <VCardText class="d-flex justify-end gap-3 flex-wrap">
        <VBtn color="secondary" variant="tonal" @click="$emit('cancel')">
          Tidak
        </VBtn>
        <VBtn @click="$emit('confirm')">
          Ya
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
