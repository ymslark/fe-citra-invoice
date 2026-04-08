<script setup>
import { useBarangStore } from '@/stores/barang';
import { VForm } from 'vuetify/components/VForm'
import {ref} from 'vue'
const barangStore = useBarangStore()
const props = defineProps({
  barang: { type: Object },
  index: { type: Number },
})
const existingKode = computed(() => barangStore.existingKode)
const existingNama = computed(() => barangStore.existingNama)

const barang = props.barang
const deleteBarang = index => barangStore.removeBarang(index)
const refForm = ref(null)
const kodeInput = ref(null)

// Auto trigger setiap kode_barang berubah
watch(() => props.barang.kode_barang,() => {
  nextTick(async () => {
    // const isKodeValid = await kodeInput.value?.validate()
    const isrefFormValid = await refForm.value?.validate()
    // console.log('Kode valid:', isKodeValid, 'Form valid:', isrefFormValid)
  })
}, { immediate: true })

</script>

<template>
  <VForm ref="refForm" @submit.prevent>
    <VRow>
      <VCol cols="12" md="3">
        <AppTextField v-model="barang.nama" label="Nama Barang" placeholder="Masukkan Nama Barang"
          :rules="[requiredValidator, existsValidator(barang.nama, existingNama, 'Nama Barang')]" />
      </VCol>
      <VCol cols="12" md="3">
        <AppTextField ref="kodeInput" v-model="barang.kode" label="Kode Barang" :rules="[requiredValidator, existsValidator(barang.kode, existingKode, 'Kode Barang')]" />
      </VCol>
      <VCol cols="12" md="3">
        <AppTextField v-model="barang.satuan" label="Satuan" placeholder="Satuan" :rules="[requiredValidator]" />
      </VCol>
      <VCol cols="12" md="3">
        <div class="pt-3">
          <VBtn color="error" @click="deleteBarang(props.index)" class="mt-3">
            Delete
          </VBtn>
        </div>
      </VCol>
      <VDivider />
    </VRow>
  </VForm>
</template>
