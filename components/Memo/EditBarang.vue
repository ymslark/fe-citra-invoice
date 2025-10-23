<script setup>
import { useMemoStore } from '../../stores/memo'

const memo = useMemoStore()

const props = defineProps({
  type: { type: String, default: 'add' },
})

const type = props.type
const barangList = type == 'add' ? memo.newMemo.barang : memo.editMemo.barang
console.log(type, barangList)
const barangStore = useBarangStore()
const cf = useCFStore()
// const addedTemp = cf.addedBarangTemp
const loading = ref(false)


const deleteBarang = id => {
  if (type == 'add') {
    memo.newMemo.barang = memo.newMemo.barang.filter(b => b._tempId !== id)
  }
  else if (type == 'edit') {
    memo.editMemo.barang = memo.editMemo.barang.filter(b => b._tempId !== id)
  }
}
const label = nama_barang => `Nama Barang (${nama_barang})`
</script>

<template>
  <VRow v-if="type == 'add'" v-for="(barang) in memo.newMemo.barang" :key="barang._tempId" class="mb-2">
    <VCol cols="12" md="6">
      <AppTextarea v-model="barang.nama_barang" placeholder="Masukkan Nama Barang" label="Nama Barang"
        :rules="[requiredValidator]" auto-grow rows="1" />
    </VCol>
    <VCol cols=" 12" md="3">
      <AppTextField v-model="barang.keterangan" label="Keterangan" placeholder="Keterangan"
        :rules="[requiredValidator]" />
    </VCol>
    <VCol cols="12" md="3">
      <AppTextField v-model="barang.qty" label="Qty" placeholder="Masukkan jumlah barang"
        :rules="[requiredValidator, integerValidator, minimumNumberValidator(barang.qty, 1)]" />
    </VCol>
    <!-- <VCol cols="12" md="3">
      <AppTextField v-model="barang.diskon_persen" label="Diskon Persen"
        :rules="[requiredValidator, integerValidator]" />
    </VCol>
    <VCol cols="12" md="3">
      <AppTextField v-model="barang.diskon_nominal" label="Diskon Nominal" placeholder="Diskon Nominal"
        :rules="[requiredValidator, integerValidator]" />
    </VCol> -->
    <VCol cols="12" md="3">
      <VBtn color="error" @click="deleteBarang(barang._tempId)" class="mt-md-5">
        Delete
      </VBtn>
    </VCol>
    <VDivider />
  </VRow>
  <VRow v-else-if="type == 'edit'" v-for="(barangs) in memo.editMemo.barang" :key="barangs._tempId" class="mb-2">
    <VCol cols="12" md="6">
      <VTextarea v-model="barangs.nama_barang" placeholder="Masukkan Nama Barang"
        :label="`nama_barang (${barangs.nama_barang})`" :rules="[requiredValidator]" auto-grow rows="1" />
    </VCol>
    <VCol cols=" 12" md="3">
      <AppTextField v-model="barangs.keterangan" label="Keterangan" placeholder="Keterangan"
        :rules="[requiredValidator]" />
    </VCol>
    <VCol cols="12" md="3">
      <AppTextField v-model="barangs.qty" label="Qty" placeholder="Masukkan jumlah barang"
        :rules="[requiredValidator, integerValidator, minimumNumberValidator(barangs.qty, 1)]" />
    </VCol>
    <!-- <VCol cols="12" md="3">
      <AppTextField v-model="barangs.diskon_persen" label="Diskon Persen"
        :rules="[requiredValidator, integerValidator]" />
    </VCol>
    <VCol cols="12" md="3">
      <AppTextField v-model="barangs.diskon_nominal" label="Diskon Nominal" placeholder="Diskon Nominal"
        :rules="[requiredValidator, integerValidator]" />
    </VCol> -->
    <VCol cols="12" md="3">
      <VBtn color="error" @click="deleteBarang(barangs._tempId)" class="mt-md-5">
        Delete
      </VBtn>
    </VCol>
    <VDivider />
  </VRow>
</template>
