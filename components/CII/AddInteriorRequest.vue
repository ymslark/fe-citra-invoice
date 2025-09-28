<script setup>
import { useCiStore } from '@/stores/ciis'

const { $api } = useNuxtApp()
const props = defineProps({
  interior: { type: Object },
  index: { type: Number },
})

const interior = props.interior

const cii = useCiStore()
const deleteInterior = index => cii.deleteInteriorRequest(interior._tempId)
const label = interior.nama_interior_request ? `Nama Interior (${interior.nama_interior_request})` : 'Nama Interior'

function formatInput(e) {
  console.log(e)
  // interior[e.target.name] = raw
  let volume = e.target.value
  if (!volume) {
    interior[e.target.name] = ""
  }
  // let raw = e.target.value.replace(/,/g, '.') // Hanya ambil angka
  // volume = volume.replace(/\D/g, '') // Hanya ambil angka
  
  // semua koma jadi titik
  volume = volume.replace(/,/g, '.')
  console.log('gaada volume', volume)

  // buang semua kecuali angka & titik
  volume = volume.replace(/[^0-9.]/g, '')

  // jaga biar cuma ada 1 titik
  const parts = volume.split('.')
  if (parts.length > 2) {
    interior[e.target.name] = parts[0].replace(/\D/g, '') + '.' + (parts.slice(1).join('')).replace(/\D/g, '')
  }
}
</script>

<template>
  <VRow>
    <VCol cols="12" md="6">
      <AppTextField v-model="interior.nama_interior" placeholder="Masukkan Nama Interior" variant="underlined" :label="label"
        :rules="[requiredValidator]" name="input-nama-interior"/>
    </VCol>
    <VCol cols="12" md="4" class="pt-3">
      <VRow class="d-flex align-center " no-gutters>
        <VCol>
          <AppTextField label="volume1(meter)" v-model="interior.v1" :rules="[requiredValidator]" append-inner-icon=" " name="v1" @input="formatInput"/>
        </VCol>
        <div class="mx-2 mt-6">X</div>
        <VCol><AppTextField label="volume2(meter)" v-model="interior.v2" :rules="[requiredValidator]" append-inner-icon=" " name="v2" @input="formatInput"/></VCol>
      </VRow>
    </VCol>
    <VCol cols="12" md="2">
      <VBtn color="error" @click="deleteInterior(index)" class="mt-md-5">
        Delete
      </VBtn>
    </VCol>
    <VDivider />
  </VRow>
</template>
