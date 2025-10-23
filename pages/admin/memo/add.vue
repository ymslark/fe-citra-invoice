<script setup>
import { VForm } from 'vuetify/components/VForm';
import { useAlertStore } from '../../../stores/alert';
import { useMemoStore } from '../../../stores/memo';
import { useSupirStore } from '../../../stores/supir';

const memo = useMemoStore()
const supir = useSupirStore()
const alert = useAlertStore()
const refForm = ref()
const newMemo = memo.newMemo

const listPerusahaan = ['CII', 'CF', 'SCI']
const route = useRoute();
const perusahaan = route.query.perusahaan || null
const id = route.query.id || null

if (perusahaan && id) {
  // console.log(perusahaan, id)
  await memo.addMemo(id, perusahaan)
  newMemo.perusahaan = perusahaan
  memo.insertTempId('new')
  if (!listPerusahaan.includes(perusahaan)) {
    //redirect to admin.memo
    navigateTo({ name: 'admin-memo' })
  }
  memo.newMemo.perusahaan = perusahaan
}



// let selectedOptions = ref(newMemo.perusahaan)
const perusahaanList = {
  CII: 'PT. Citra Interior Indonesia (CII)',
  CF: 'PT. Citra Furniture Indonesia (CF)',
  SCI: 'PT. Sentral Citra Indonesia (SCI)',
}
// [
//   // { title: 'PT. Citra Interior Indonesia (CII)', value: 'CII' },
//   // { title: 'PT. Citra Furniture Indonesia (CF)', value: 'CF' },
//   // { title: 'PT. Sentral Citra Indonesia (SCI)', value: 'SCI' },
//   CII: 
// ]


const jenisMemo = ['Pengambilan Barang', 'Pengiriman Barang']
// const jenisMemoValue = ref(jenisMemo[1])

const supirList = await supir.fetchSupirs()
console.log(supirList)
// const supir = ref()
// menampilkan data selectedOptions bila berubah
// watch(selectedOptions, (newValue) => {
//   if (newValue) {
//     console.log(selectedOptions.value)
//   }
// })

const tambahBarang = () => memo.addBarang('new')
// const tambahInterior = () => memo.addInterior('new')

const store = async () => {
  try {
    // refForm?.value?.validate()
    const valid = await refForm?.value?.validate()
    if (!valid.valid) { window.scrollTo(0, 0); return }
    if (newMemo.barang.length == 0) throw { message: 'Barang tidak boleh kosong' }

    const response = await memo.storeMemo()
    console.log(response)
    alert.showAlertObject({
      message: 'Berhasil Menambah Surat Jalan',
      type: 'success',
    })
    window.scrollTo(0, 0)
    memo.resetNewMemo()
    setTimeout(() => {
      navigateTo({ name: 'admin-memo' })
    }, 4000)

  } catch (error) {
    window.scrollTo(0, 0)
    console.log(error)
    alert.showAlertObject({
      message: error.message,
      type: 'error',
    })
    // setTimeout(() => {
    //   cf.setAlertNull()
    // }, 4000)
  }
}
</script>

<template>
  <!-- <span v-if="perusahaan">{{ perusahaan }}</span> -->
  <VForm ref="refForm" @submit.prevent>
    <VCard>
      <VCardTitle>
        <span class="text-h6">Tambah Surat Jalan</span>
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="12" md="6">
            <AppTextField v-model="newMemo.tujuan" label="Kepada" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="6">
            <AppTextField v-if="perusahaan" :value="perusahaanList[perusahaan]" label="Perusahaan" readonly />
            <AppSelect v-else v-model="newMemo.perusahaan"
            :items="Object.entries(perusahaanList).map(([value, title]) => ({ value, title }))" label="Perusahaan"
            :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="6">
            <AppDateTimePicker v-model="newMemo.tanggal" label="Tanggal" placeholder="Pilih Tanggal"
            :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="6">
            <AppTextField v-model="newMemo.no_hp" label="No HP Tujuan" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="6">
            <AppSelect v-model="newMemo.jenis_memo" label="Jenis Memo" :items="jenisMemo"
              :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="6">
            <AppSelect :items="supirList" item-value="_id" item-title="nama_supir" v-model="newMemo.id_supir"
              label="Supir" :rules="[requiredValidator]" />
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12">
            <VTextarea v-model="newMemo.alamat" label="Alamat" auto-grow rows="1" />
          </VCol>
        </VRow>
      </VCardText>
      <VCardItem>
        <VCol cols="12" offset-md="8" md="4">
          <!-- <MemoAddBarang v-for="(barang, index) in newMemo.barang" :key="index" :barang="barang" :index="index" /> -->
        </VCol>
      </VCardItem>
    </VCard>
    <VCard class="mt-4">
      <div class="d-flex justify-space-between">
        <VCardTitle class="ma-2">
          Daftar Barang
        </VCardTitle>
        <VBtn color="primary" @click="tambahBarang" class="ma-3">
          Add
        </VBtn>
      </div>
      <VCardText>
        <MemoAddBarang type="add" />
      </VCardText>
      <VCardText class="d-flex justify-end gap-2">
        <VBtn type="submit" @click="store">
          Submit
        </VBtn>
      </VCardText>
    </VCard>
  </VForm>
</template>
