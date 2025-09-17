<script setup>
import { VForm } from 'vuetify/components/VForm';
import { useAlertStore } from '../../../../stores/alert';
import { useMemoStore } from '../../../../stores/memo';
import { useSupirStore } from '../../../../stores/supir';

const memo = useMemoStore()
const supir = useSupirStore()
const alert = useAlertStore()
const refForm = ref()

const listPerusahaan = ['CII', 'CF', 'SCI']
const route = useRoute();
const id = route.params.id || null


const showDialog = ref(false)
const showDialogRestore = ref(false)

let detailMemo = null
if (id) {
  try {
    const response = await memo.getMemoById(id)
    console.log(response)
    detailMemo = response.doc

  } catch (error) {
    console.error('Error fetching memo details:', error)
    alert.showAlertObject({
      message: 'Gagal mengambil detail memo',
      type: 'error',
    })
    // navigateTo({ name: 'admin-memo' })
  }
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
const jenisMemoValue = ref(jenisMemo[1])

const supirList = await supir.fetchSupirs()
console.log(supirList)
// const supir = ref()
// menampilkan data selectedOptions bila berubah
// watch(selectedOptions, (newValue) => {
//   if (newValue) {
//     console.log(selectedOptions.value)
//   }
// })

const tambahBarang = () => {
  memo.addBarang()
}
const goToEditPage = () => {
  if (id) {
    navigateTo(`${AUTH_ORIGIN}/admin/Memo/edit/${id}`)
  } else {
    alert.showAlertObject({
      message: 'ID memo tidak ditemukan',
      type: 'error',
    })
  }
}

const deleteMemo = async () => {
  if (id) {
    try {
      await memo.deleteMemo(id)
      alert.showAlertObject({
        message: 'Memo berhasil dihapus',
        type: 'success',
      })
      navigateTo({ name: 'admin-memo' })
    } catch (error) {
      console.error('Error deleting memo:', error)
      alert.showAlertObject({
        message: 'Gagal menghapus memo',
        type: 'error',
      })
    }
  } else {
    alert.showAlertObject({
      message: 'ID memo tidak ditemukan',
      type: 'error',
    })
  }
}
const restoreMemo = async () => {
  if (id) {
    try {
      await memo.restoreMemo(id)
      alert.showAlertObject({
        message: 'Memo berhasil di-restore',
        type: 'success',
      })
      navigateTo({ name: 'admin-memo' })
    } catch (error) {
      console.error('Error restoring memo:', error)
      alert.showAlertObject({
        message: 'Gagal me-restore memo',
        type: 'error',
      })
    }
  } else {
    alert.showAlertObject({
      message: 'ID memo tidak ditemukan',
      type: 'error',
    })
  }
}


</script>

<template>
  <!-- <span v-if="perusahaan">{{ perusahaan }}</span> -->
  <VForm ref="refForm" @submit.prevent>
    <VCard>
      <VCardTitle>
        Detail Memo
        <div class="d-flex justify-end gap-2">
          <!-- <VBtn size="small" color="primary" @click="navigateTo({ name: 'admin-memo' })">Kembali</VBtn> -->
          <VBtn size="small" color="primary" @click="navigateTo({ name: `admin-memo-edit-id`, params: { id } })">
            <VIcon>tabler-edit</VIcon>Edit
          </VBtn>
          <VBtn size="small" color="info" @click="navigateTo({ name: 'admin-memo-print', params: { id }, query: { id } })">
            <VIcon>tabler-printer</VIcon> Print
          </VBtn>
          <VBtn size="small" v-if="detailMemo.isActive" color="error" @click="showDialog = true">
            <VIcon>tabler-trash</VIcon>Hapus
          </VBtn>
          <VBtn size="small" v-else color="success" @click="showDialogRestore = true">
            <VIcon>tabler-restore</VIcon>restore
          </VBtn>
        </div>
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="12" md="6">
            <AppTextField :value="perusahaanList[detailMemo.perusahaan]" label="Perusahaan" readonly />
            <!-- <AppSelect v-else :value="newMemo.perusahaan"
              :items="Object.entries(perusahaanList).map(([value, title]) => ({ value, title }))" label="Perusahaan"
              :rules="[requiredValidator]" disabled/> -->
          </VCol>
          <VCol cols="12" md="6">
            <AppDateTimePicker v-model="detailMemo.tanggal" label="Tanggal" placeholder="Pilih Tanggal"
              :rules="[requiredValidator]" readonly />
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" md="6">
            <AppSelect v-model="jenisMemoValue" label="Jenis Memo" :items="jenisMemo" :rules="[requiredValidator]"
              readonly />
          </VCol>
          <VCol cols="12" md="6">
            <AppTextField v-model="detailMemo.tujuan" label="Kepada" :rules="[requiredValidator]" readonly />
          </VCol>
          <VCol cols="12" md="6">
            <AppTextField v-model="detailMemo.supir.nama_supir" label="Supir" :rules="[requiredValidator]" readonly />
          </VCol>
          <VCol cols="12" md="6">
            <AppTextField v-model="detailMemo.status" label="Status" :rules="[requiredValidator]" readonly />
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12">
            <VTextarea v-model="detailMemo.alamat" label="Alamat" :rules="[requiredValidator]" readonly auto-grow
              rows="1" />
          </VCol>
        </VRow>
      </VCardText>
      <VCardItem>
        <VCol cols="12" offset-md="8" md="4">
          <!-- <MemoAddBarang v-for="(barang, index) in detailMemo.barang" :key="index" :barang="barang" :index="index" /> -->
        </VCol>
      </VCardItem>
    </VCard>
    <VCard class="mt-4">
      <VCardTitle class="ma-2">
        Daftar Barang
      </VCardTitle>
      <VCardItem>
        <VTable fixed-header class="text-no-wrap mb-4">
          <thead>
            <tr>
              <th class="text-uppercase">No.</th>
              <th class="text-uppercase">Nama Barang</th>
              <th class="text-uppercase text-center">Jumlah</th>
              <th class="text-uppercase text-center">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(barang, index) in detailMemo.barang" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ barang.nama_barang }}</td>
              <td class="text-center">{{ barang.qty }}</td>
              <td>{{ barang.keterangan }}</td>
            </tr>
          </tbody>
        </VTable>
      </VCardItem>
    </VCard>
  </VForm>
  <UtilsConfirmDialog :show="showDialog" message="Apakah Anda Yakin Ingin menghapus memo ini??" @confirm="deleteMemo"
    @cancel="showDialog = false" />
  <UtilsConfirmDialog :show="showDialogRestore" message="Apakah Anda Yakin Ingin me-restore memo ini??" @confirm="restoreMemo"
    @cancel="showDialogRestore = false" />
</template>
