<script setup>
// import { useInteriorStore } from '@/stores/interior'
import { useCiStore } from '@/stores/ciis'
import { ref } from 'vue'

const { $api } = useNuxtApp()
const props = defineProps({
  interior: { type: Object },
  index: { type: Number },
})

const interior = props.interior
const index = props.index

// const interiorStore = useInteriorStore()
const cii = useCiStore()
const addedTemp = cii.addedInteriorTemp
const loading = ref(false)


const deleteInterior = index => cii.deleteInterior(index)
console.log(interior)
const label = interior.nama_interior_request ? `Nama Interior (${interior.nama_interior_request})` : 'Nama Interior'


function formatInput(e) {
  console.log(e)
  if(e.target.name == 'harga'){
    let raw = e.target.value.replace(/\D/g, '') // Hanya ambil angka
    // interior[e.target.name] = parseInt(raw || '0').toLocaleString('id-ID') // Format pakai titik
    interior[e.target.name] = parseInt(raw || '0').toLocaleString('id-ID') // Format pakai titik
  }
  if(e.target.name == 'v1' || 'v2'){
    // interior[e.target.name] = raw
    let volume = e.target.value
    if (!volume) {
      interior[e.target.name] = ""
    }
    // let raw = e.target.value.replace(/,/g, '.') // Hanya ambil angka
    // volume = volume.replace(/\D/g, '') // Hanya ambil angka
    
    // semua koma jadi titik
    volume = volume.replace(/,/g, '.')
    
    // buang semua kecuali angka & titik
    volume = volume.replace(/[^0-9.]/g, '')
    
    console.log(volume)
    // jaga biar cuma ada 1 titik
    const parts = volume.split('.')
    if (parts.length > 2) {
      interior[e.target.name] = parts[0].replace(/\D/g, '') + '.' + (parts.slice(1).join('')).replace(/\D/g, '')
    }
  }
}
onMounted(() => {
  //
  interior.harga = parseInt(interior.harga || '0').toLocaleString('id-ID') // Format pakai titik
  // eslint-disable-next-line camelcase
  interior.diskon_nominal = parseInt(interior.diskon_nominal || '0').toLocaleString('id-ID') // Format pakai titik
})
</script>

<template>
  <VRow>
    <VCol cols="12" md="8">
      <AppTextField v-model="interior.nama_interior" placeholder="Masukkan Nama Interior" variant="underlined" :label="label"
        :rules="[requiredValidator]" name="input-nama-interior"/>
    </VCol>
    <VCol cols=" 12" md="3">
      <AppTextField v-model="interior.harga" label="Harga" placeholder="Masukkan Harga"
        name="harga"
        :rules="[requiredValidator]"
        @input="formatInput" />
    </VCol>
    <VCol cols="12" md="6" class="pt-3">
      <VRow class="d-flex align-center" no-gutters>
        <VCol>
          <AppTextField label="volume1" v-model="interior.v1" :rules="[requiredValidator]" append-inner-icon=" " name="v1" @input="formatInput"/>
        </VCol>
        <div class="mx-2">X</div>
        <VCol><AppTextField label="volume2" v-model="interior.v2" :rules="[requiredValidator]" append-inner-icon=" " name="v2" @input="formatInput"/></VCol>
      </VRow>
    </VCol>
    <VCol cols="12" md="3">
      <AppTextField v-model="interior.diskon_persen" label="Diskon Persen"
        :rules="[requiredValidator, integerValidator]" />
    </VCol>
    <VCol cols="12" md="3">
      <AppTextField v-model="interior.diskon_nominal" label="Diskon Nominal" placeholder="Diskon Nominal"
        :rules="[requiredValidator, integerValidator]" />
    </VCol>
    <VCol cols="12" md="3">
      <VBtn color="error" @click="deleteInterior(index)" class="mt-md-5">
        Delete
      </VBtn>
    </VCol>
    <VDivider />
  </VRow>
</template>
