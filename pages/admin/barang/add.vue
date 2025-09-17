<script setup>
import { useAlertStore } from '@/stores/alert';
import { useBarangStore } from '@/stores/barang';
const { t } = useI18n()
let barang = useBarangStore()
let alert = useAlertStore()
const addedBarang = barang.addedBarang

const addBarang = () => barang.addBarang()


const saveBarang = async () => {
  try {
    const response = await barang.storeBarang()
    console.log(response)

    // console.log(response)
    alert.showAlert('success', 'Data berhasil disimpan')
  } catch (error) {
    console.log(error)
    let message = error.message
    if (error.message === 'KODE_BARANG_ALREADY_EXIST') {
      barang.existingKode = error.existingKode
      message = `${t(error.message)}, (${error.existingKode})`
    }
    alert.showAlert('error', t(message))
  }
}

</script>
<template>
  <div>
    <VCard class="mt-4">
      <VCardTitle>
        Daftar Barang
        <VBtn color="primary" @click="addBarang">
          Add
        </VBtn>
      </VCardTitle>
      <VSpacer />
      <VCardItem>
        <VCol cols="12" offset-md="8" md="4" />
        <VForm>
          <BarangAddBarang v-for="(barang, index) in addedBarang" :key="index" :barang="barang" :index="index" />
        </VForm>
      </VCardItem>
      <VCardItem>
        <VBtn color="primary" @click="saveBarang">
          Save
        </VBtn>
      </VCardItem>
    </VCard>
  </div>
</template>
