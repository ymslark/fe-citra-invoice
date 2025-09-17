<script setup>
// import { useBarangStore } from '@/stores/barang'
// import { useCFStore } from '@/stores/cf'
// import { format } from 'node:path'
import { ref } from 'vue'

const { $api } = useNuxtApp()
const props = defineProps({
  item: { type: Object },
  index: { type: Number },
  // items: { type: Array, default: () => [] },
})

console.log(props.item)
const item = props.item
// const barang = props.barang

// const barangStore = useBarangStore()
// const cf = useCFStore()
// const addedTemp = cf.addedBarangTemp
// const loading = ref(false)
// const items = [...props.items]

// // const deleteBarang = index => cf.deleteBarangEdit(index)
// const deleteBarang = _tempId => cf.deleteBarangEditByTempId(_tempId)
// const label = barang.nama_barang_request ? `Nama Barang (${barang.nama_barang_request})` : 'Nama Barang'
const items = ['Barang A', 'Barang B', 'Barang C']
const selectedBarang = ref(null)
const harga = ref('0')
const label = 'Nama Barang'
const nama_barang = ref('')
const qty = ref(1)
const diskon_nominal = ref('0')

function formatInput(e) {
  console.log(e)
  let raw = e.target.value.replace(/\D/g, '') // Hanya ambil angka
  // interior[e.target.name] = parseInt(raw || '0').toLocaleString('id-ID') // Format pakai titik
//   barang[e.target.name] = parseInt(raw || '0').toLocaleString('id-ID') // Format pakai titik
    if (e.target.name === 'harga') {
        item.harga = parseInt(raw || '0').toLocaleString('id-ID') // Format pakai titik
    } else if (e.target.name === 'diskon_nominal') {
        diskon_nominal.value = parseInt(raw || '0').toLocaleString('id-ID') // Format pakai titik
    }
}
onMounted(() => {
  //
  // item.harga = replace(/\D/g, '')
  item.harga = parseInt(item.harga || '0').toLocaleString('id-ID') // Format pakai titik

})

// const items = [{ 'nama_barang': 'Barang A' }, { 'nama_barang': 'Barang B' }, { 'nama_barang': 'Barang C' }]
</script>

<template>
  <VRow>
    <VCol cols="12" md="6" class="pt-5">
      <VTextField v-model="item.nama_barang" placeholder="Masukkan Nama Barang" :label="label"
        :rules="[requiredValidator]" />
    </VCol>
    <!-- <VCol cols="12" md="8">
    <VAutocomplete
      :label="label"
      :items="items"
      v-model="selectedBarang"
      placeholder="Pilih Barang"
      :rules="[requiredValidator]"
    />
    </VCol> -->
    <VCol cols="12" md="3" class="pt-md-5">
      <VTextField 
        v-model="item.harga" label="Harga" placeholder="Masukkan Harga"
        lazy-validator
        :rules="[minimumFormattedNumberValidator(item.harga, 2000)]" 
        name="harga"
        @input="formatInput"
      />
    </VCol>
    <VCol cols="12" md="1" class="pt-md-5">
      <VTextField v-model="item.qty" label="Qty" placeholder="Masukkan jumlah barang"
        :rules="[requiredValidator]" />
    </VCol>
    <!-- <VCol cols="12" md="3">
      <VTextField v-model="item.diskon_nominal" label="Diskon Nominal" placeholder="Diskon Nominal"
        :rules="[requiredValidator, ]" 
        name="diskon_nominal"
        @input="formatInput"/>
    </VCol> -->
    <VCol cols="12" md="2" class="pt-md-5">
      <VBtn color="error">
        Delete
      </VBtn>
    </VCol>
    <VDivider />
  </VRow>
</template>
