<script setup>
const props = defineProps({
//   show: {
//     type: Boolean,
//     default: false
//   },
  message: {
    type: String,
    default: 'Permintaan Anda Sudah kami Terima, pesanan akan segera kami proses'
  },
  type: {
     type: String,
     default: 'success' // info, success, warning, error
    }
})

// // defineEmits()
// defineEmits(['end'])


const isDialogVisible = ref(true)
// function showDialog() {
//     isDialogVisible.value = props.modelValue
//     setTimeout(() => {
//         isDialogVisible.value = false
//         emit('end')
//     }, 3000)
// }

</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    persistent
    class="v-dialog-lg"
  > 
    <!-- <VDialogCloseBtn /> -->

    <!-- Dialog Content -->
    <!-- <VCard title="Use Google's location service?">
      <VCardText>
        aman
    </VCardText>

      <VCardText class="d-flex justify-end gap-3 flex-wrap">
        <VBtn
          color="secondary"
          variant="tonal"
          @click="isDialogVisible = false"
        >
          Disagree
        </VBtn>
        <VBtn @click="isDialogVisible = false">
          Agree
        </VBtn>
      </VCardText>
    </VCard> -->
    <!-- Alert -->
    <VAlert
    :color="type"
    class="mx-4 my-2"
    icon="tabler-check"
  >
  <!-- anu -->
   <div class="d-flex justify-center">

       <div class=" text-h6 text-md-h5 text-white">{{ message }}</div>
   </div>
  </VAlert>
     <!-- <VCard>

     </VCard> -->
  
  </VDialog>
</template>
