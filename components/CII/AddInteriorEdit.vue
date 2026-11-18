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

// const interiorStore = useInteriorStore()
const cii = useCiStore()
const addedTemp = cii.addedInteriorTemp
const loading = ref(false)


const deleteInterior = index => cii.deleteInteriorEdit(index)
let label = interior.nama_interior_request ? `Nama Interior (${interior.nama_interior_request}) ` : 'Nama Interior '
label += ' (wajib diisi)'
function formatInput(e) {
  // console.log(e)
  let raw = e.target.value.replace(/\D/g, '') // Hanya ambil angka
  // interior[e.target.name] = parseInt(raw || '0').toLocaleString('id-ID') // Format pakai titik
  interior[e.target.name] = parseInt(raw || '0').toLocaleString('id-ID') // Format pakai titik
}

function formatKoma(e) {
  if (e.key !== ',') return
  e.preventDefault()

  const el = e.target
  const val = el.value
  const start = el.selectionStart
  const end = el.selectionEnd

  // kalau sudah ada titik, jangan tambah lagi
  if (val.includes('.')) return

  el.value = val.slice(0, start) + '.' + val.slice(end)
  raw.value = el.value
  el.setSelectionRange(start + 1, start + 1)
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
      <AppTextField v-model="interior.harga" label="Harga (wajib diisi)" placeholder="Masukkan Harga"
        :rules="[requiredValidator, minimumFormattedNumberValidator(interior.harga, 2000)]" 
        name="harga"
        @input="formatInput" />
    </VCol>
    <VCol cols="12" md="5" class="pt-3">
      <VRow class="d-flex align-center">
        <VCol>
          <AppTextField label="volume1(meter) (wajib diisi)" v-model="interior.v1" :rules="[requiredValidator]" append-inner-icon="tabler-letter-m" append-icon="tabler-letter-x" @keydown="formatKoma"/>
        </VCol>
        <VCol><AppTextField label="volume2(meter) (wajib diisi)" v-model="interior.v2" :rules="[requiredValidator]" append-inner-icon="tabler-letter-m" @keydown="formatKoma"/></VCol>
      </VRow>
    </VCol>
    <VCol cols="12" md="3">
      <AppTextField v-model="interior.diskon_persen" label="Diskon Persen"
        :rules="[requiredValidator, integerValidator]" />
    </VCol>
    <VCol cols="12" md="3">
      <AppTextField v-model="interior.diskon_nominal" label="Diskon Nominal" placeholder="Diskon Nominal"
        :rules="[requiredValidator]" 
        name="diskon_nominal"
        @input="formatInput" />
    </VCol>
    <VCol cols="12" md="3">
      <VBtn color="error" @click="deleteInterior(index)" class="mt-md-5">
        Delete
      </VBtn>
      <!-- {{ $parseRupiah(interior.harga) }} -->
    </VCol>
    <VDivider />
  </VRow>
</template>
