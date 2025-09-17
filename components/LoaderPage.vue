<script setup>
const isDialogVisible = ref(true)

onMounted(() => {
  // Simulasi pemuatan data dengan timeout
  setTimeout(() => {
    isDialogVisible.value = false; // Tutup dialog setelah data selesai dimuat
  }, 2000);
});
</script>

<template>

  <!-- Dialog --> 
      <VDialog v-model="isDialogVisible" persistent class="mx-auto w-md-25 w-100 v-dialog-sm">
        <!-- Dialog close btn -->
        <VCard>
          <VCardTitle class="text-h5 text-center">
            Memuat Halaman
          </VCardTitle>
          <VCardText class="pt-3 text-h6">
            Tunggu Sebentar, Halaman sedang dimuat...
            <VProgressLinear indeterminate bg-color="rgba(var(--v-theme-surface), 0.1)" :height="8" class="mb-0 mt-4" />
          </VCardText>
        </VCard>

      </VDialog>

</template>
