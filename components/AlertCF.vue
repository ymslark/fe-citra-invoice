<template>
  <VAlert v-if="alertStore.show" :type="alertStore.type" dismissible class="global-alert"
    @input="alertStore.hideAlert()">
    {{ alertStore.message }}
  </VAlert>
</template>

<script setup>
import { useAlertStore } from '@/stores/alert';

const alertStore = useAlertStore()
</script>
