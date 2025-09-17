<script setup>
import { useCFStore } from '@/stores/cf'

const { $api } = useNuxtApp()
const props = defineProps({
  barang: { type: Object },
  index: { type: Number },
})

const barang = props.barang

const cf = useCFStore()
const deleteBarang = index => cf.deleteBarangRequest(index)
const label = barang.nama_barang_request ? `Nama Barang (${barang.nama_barang_request})` : 'Nama Barang'
</script>

<template>
  <VRow>
    <VCol cols="12" md="8">
      <AppTextarea rows="1" auto-grow v-model="barang.nama_barang" placeholder="Masukkan Nama Barang"
        variant="underlined" :label="label" :rules="[requiredValidator]" />
    </VCol>
    <VCol cols="8" md="2">
      <AppTextField v-model="barang.qty" label="Qty" placeholder="Masukkan jumlah barang"
        :rules="[requiredValidator, integerValidator, minimumNumberValidator(barang.qty, 1)]" />
    </VCol>
    <VCol cols="2" class="d-flex align-end">
      <VBtn color="error" @click="deleteBarang(index)">
        Delete
      </VBtn>
    </VCol>
    <VDivider />
  </VRow>
</template>
