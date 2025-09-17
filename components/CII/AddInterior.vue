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


const deleteInterior = index => cii.deleteInterior(index)
const label = interior.nama_interior_request ? `Nama Interior (${interior.nama_interior_request})` : 'Nama Interior'
</script>

<template>
  <VRow>
    <VCol cols="12" md="8">
      <AppTextField v-model="interior.nama_interior" placeholder="Masukkan Nama Interior" variant="underlined" :label="label"
        :rules="[requiredValidator]" />
    </VCol>
    <VCol cols=" 12" md="3">
      <AppTextField v-model="interior.harga" label="Harga" placeholder="Masukkan Harga"
        :rules="[requiredValidator, integerValidator, minimumNumberValidator(interior.harga, 1)]" />
    </VCol>
    <VCol cols="12" md="6" class="pt-3">
      <VRow class="d-flex align-center" no-gutters>
        <VCol>
          <AppTextField label="volume1" v-model="interior.v1" :rules="[requiredValidator]" append-inner-icon=" "/>
        </VCol>
        <div class="mx-2">X</div>
        <VCol><AppTextField label="volume2" v-model="interior.v2" :rules="[requiredValidator]" append-inner-icon=" "/></VCol>
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
