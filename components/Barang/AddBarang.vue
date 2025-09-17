<script setup>
import { useBarangStore } from '@/stores/barang';

const barangStore = useBarangStore()
const props = defineProps({
  barang: { type: Object },
  index: { type: Number },
})

const barang = props.barang
const deleteBarang = index => barangStore.removeBarang(index)
</script>

<template>
  <VRow>
    <VCol cols="12" md="3">
      <AppTextField v-model="barang.nama" label="Nama Barang" placeholder="Masukkan Nama Barang"
        :rules="[requiredValidator]" />
    </VCol>
    <VCol cols="12" md="3">
      <AppTextField v-model="barang.kode" label="Kode Barang" :rules="[requiredValidator]" />
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
</template>
