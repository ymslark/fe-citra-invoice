<script setup>
import { useBarangStore } from '@/stores/barang'
import { useSCIStore } from '@/stores/sci'
// import { format } from 'node:path'
import { ref } from 'vue'

const { $api } = useNuxtApp()
const props = defineProps({
  barang: { type: Object },
  index: { type: Number },
  items: { type: Array, default: () => [] },
})
const barang = props.barang
// console.log(barang)

const barangStore = useBarangStore()
const sci = useSCIStore()
const addedTemp = sci.addedBarangTemp
const loading = ref(false)
const items = [...props.items]

const deleteBarang = _tempId => sci.deleteBarangByTempId(_tempId)
// const deleteBarang = index => sci.deleteBarang(index)
const label = barang.nama_barang_request ? `Nama Barang (${barang.nama_barang_request}) (wajib diisi)` : 'Nama Barang  (wajib diisi)'

function formatInput(e) {
  console.log(e)
  let raw = e.target.value.replace(/\D/g, '') // Hanya ambil angka
  // interior[e.target.name] = parseInt(raw || '0').toLocaleString('id-ID') // Format pakai titik
  barang[e.target.name] = parseInt(raw || '0').toLocaleString('id-ID') // Format pakai titik
}
onMounted(() => {
  //
  barang.harga = parseInt(barang.harga || '0').toLocaleString('id-ID') // Format pakai titik
  // eslint-disable-next-line camelcase
  barang.diskon_nominal = parseInt(barang.diskon_nominal || '0').toLocaleString('id-ID') // Format pakai titik
})


</script>

<template>
  <VRow>
    <!-- <VCol cols="12" md="8">
      <VTextField v-model="barang.nama_barang" placeholder="Masukkan Nama Barang" :label="label"
        :rules="[requiredValidator]" />
    </VCol> -->
    <VCol cols="12" md="8">
    <VAutocomplete
      :label="label"
      :items="items"
      v-model="barang.nama_barang"
      placeholder="Pilih Barang"
      :rules="[requiredValidator]"
       name="input-nama-barang"
    />
    </VCol>
    <VCol cols=" 12" md="3">
      <VTextField 
        v-model="barang.harga" label="Harga (wajib diisi)" placeholder="Masukkan Harga" 
        lazy-validator
        :rules="[minimumFormattedNumberValidator(barang.harga, 2000)]" 
        name="harga"
        @input="formatInput"
      />
    </VCol>
    <VCol cols="12" md="3">
      <VTextField v-model="barang.qty" label="Qty (wajib diisi)" placeholder="Masukkan jumlah barang"
        :rules="[requiredValidator]" />
    </VCol>
    <VCol cols="12" md="3">
      <VTextField v-model="barang.diskon_persen" label="Diskon Persen"
        :rules="[requiredValidator, integerValidator]" />
    </VCol>
    <VCol cols="12" md="3">
      <VTextField v-model="barang.diskon_nominal" label="Diskon Nominal" placeholder="Diskon Nominal"
        :rules="[requiredValidator]" 
        name="diskon_nominal"
        @input="formatInput"/>
    </VCol>
    <VCol cols="12" md="3">
      <VBtn color="error" @click="deleteBarang(barang._tempId)">
        Delete
      </VBtn>
    </VCol>
    <VDivider />
  </VRow>
</template>
