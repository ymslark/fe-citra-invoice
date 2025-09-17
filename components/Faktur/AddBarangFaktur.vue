<script setup>
import { useBarangStore } from '@/stores/barang';
import { useFakturStore } from '@/stores/faktur';
const barangStore = useBarangStore()
const props = defineProps({
  barang: { type: Object },
  index: { type: Number },
  _tempId: { type: String },
})

const barang = props.barang
const faktur = useFakturStore()
const deleteBarang = _tempId => faktur.hapusBarangByTempId(_tempId)
// const deleteBarang = index => faktur.removeBarang(index)

function formatInput(e) {
  console.log(e)
  let raw = e.target.value.replace(/\D/g, '') // Hanya ambil angka
  // interior[e.target.name] = parseInt(raw || '0').toLocaleString('id-ID') // Format pakai titik
  barang[e.target.name] = parseInt(raw || '0').toLocaleString('id-ID') // Format pakai titik
}
onMounted(() => {
  //
  barang.harga = parseInt(barang.harga || '0').toLocaleString('id-ID') // Format pakai titik
})
</script>

<template>
  <VRow>
    <VCol cols="12" md="3">
      <AppTextField v-model="barang.nama_barang" label="Nama Barang" placeholder="Masukkan Nama Barang"
        :rules="[requiredValidator]" />
    </VCol>
    <VCol cols="12" md="3">
      <AppTextField 
      v-model="barang.harga" label="Harga" placeholder="Masukkan Harga" 
      lazy-validator
      :rules="[minimumFormattedNumberValidator(barang.harga, 2000)]" 
      name="harga"
      @input="formatInput"
    />
    </VCol>
    <VCol cols="12" md="3">
      <AppTextField
      v-model="barang.qty" label="Qty" placeholder="Masukkan Qty"
      :rules="[minimumFormattedNumberValidator(barang.qty, 1)]"
      />
    </VCol>
    <VCol cols="12" md="3">
      <div class="pt-md-3 mb-3">
        <VBtn color="error" @click="deleteBarang(_tempId)" class="mt-3">
          Delete
        </VBtn>
      </div>
    </VCol>
    <!-- <VDivider /> -->
  </VRow>
</template>
