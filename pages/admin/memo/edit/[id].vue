<script setup>
import { VForm } from 'vuetify/components/VForm';
import { useAlertStore } from '../../../../stores/alert';
import { useMemoStore } from '../../../../stores/memo';
import { useSupirStore } from '../../../../stores/supir';
// import {crypto} from 'crypto'
import { v4 as uuidv4 } from 'uuid'

const memo = useMemoStore()
const supir = useSupirStore()
const alert = useAlertStore()
const refForm = ref()


const listPerusahaan = ['CII', 'CF', 'SCI']
const route = useRoute();
const id = route.params.id || null
// const id = route.query.id || null

if (!id) {
  navigateTo({ name: 'admin-memo' })
}
try {
  const response = await memo.getMemoById(id)
  console.log(response)
  memo.editMemo = response.doc
  delete memo.editMemo._id
  delete memo.editMemo.__v
  delete memo.editMemo.createdAt
  delete memo.editMemo.updatedAt
  memo.editMemo.barang = memo.editMemo.barang.map(barang => ({
    ...barang,
    _tempId: uuidv4(), // atau Date.now() atau counter manual
  }))
  memo.editMemo.id_supir = response.doc.supir._id
} catch (error) {

}

const editMemo = memo.editMemo
// if (id) {
//   // console.log(perusahaan, id)
//   await memo.addMemo(id, perusahaan)
//   editMemo.perusahaan = perusahaan
//   // const supirs = await supir.fetchSupirs()
//   // console.log(supirs)
//   if (!listPerusahaan.includes(perusahaan)) {
//     //redirect to admin.memo
//     navigateTo({ name: 'admin-memo' })
//   }
//   memo.editMemo.perusahaan = perusahaan

// }

const detailMemo = await memo.getMemoById(id)

// let selectedOptions = ref(editMemo.perusahaan)
const perusahaanList = {
  CII: 'PT. Citra Interior Indonesia (CII)',
  CF: 'PT. Citra Furniture Indonesia (CF)',
  SCI: 'PT. Sentral Citra Indonesia (SCI)',
}

const status = ['WAITING', 'PROCCESS', 'DONE', 'CANCEL']


const jenisMemo = ['Pengambilan Barang', 'Pengiriman Barang']

const supirList = await supir.fetchSupirs()

const tambahBarang = () => {
  memo.addBarang('edit')
}

const update = async () => {
  try {
    // refForm?.value?.validate()
    const valid = await refForm?.value?.validate()
    if (!valid.valid) { window.scrollTo(0, 0); return }
    if (editMemo.barang.length == 0) throw { message: 'Barang tidak boleh kosong' }

    const response = await memo.updateMemo(id)
    console.log(response)
    alert.showAlertObject({
      message: 'Berhasil Mengubah Surat Jalan',
      type: 'success',
    })
    window.scrollTo(0, 0)

    setTimeout(() => {
      navigateTo({ name: 'admin-memo-detail-id', params: { id } })
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
            <AppTextField v-if="perusahaan" :value="perusahaanList[perusahaan]" label="Perusahaan" readonly />
            <AppSelect v-else v-model="editMemo.perusahaan"
              :items="Object.entries(perusahaanList).map(([value, title]) => ({ value, title }))" label="Perusahaan"
              :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="6">
            <AppDateTimePicker v-model="editMemo.tanggal" label="Tanggal" placeholder="Pilih Tanggal"
              :rules="[requiredValidator]" />
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" md="6">
            <AppSelect v-model="editMemo.jenis_memo" label="Jenis Memo" :items="jenisMemo"
              :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="6">
            <AppTextField v-model="editMemo.tujuan" label="Kepada" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="6">
            <AppTextField v-model="editMemo.no_hp" label="Nomor Hp" :rules="[requiredValidator]" />
          </VCol>
          <VCol cols="12" md="6">
            <AppSelect :items="supirList" item-value="_id" item-title="nama_supir" v-model="editMemo.id_supir"
              label="Supir" :rules="[requiredValidator]"/>
          </VCol>
          <VCol cols="12" md="6">
            <AppSelect :items="status" v-model="editMemo.status" label="Status" :rules="[requiredValidator]" />
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12">
            <VTextarea v-model="editMemo.alamat" label="Alamat" auto-grow rows="1" />
          </VCol>
        </VRow>
      </VCardText>
      <VCardItem>
        <VCol cols="12" offset-md="8" md="4">
          <!-- <MemoAddBarang v-for="(barang, index) in editMemo.barang" :key="index" :barang="barang" :index="index" /> -->
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
        <MemoAddBarang type="edit" />
      </VCardText>
      <VCardText class="d-flex justify-end gap-2">
        <VBtn type="submit" @click="update">
          Submit
        </VBtn>
      </VCardText>
    </VCard>
  </VForm>
</template>
