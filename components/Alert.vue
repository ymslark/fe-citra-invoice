<script setup>
import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore()
const message = alertStore.message.replaceAll('_', ' ')
// const not_availabe
// const alert = alertStore.alert

</script>
<template>
  <VRow>
    <VCol cols="12" class="mx-auto">
      <VAlert v-model="alertStore.show" :type="alertStore.type" dismissible class="mb-4">
        {{ $t(alertStore.message, message) }}
      </VAlert>
    </VCol>
  </VRow>
</template>
