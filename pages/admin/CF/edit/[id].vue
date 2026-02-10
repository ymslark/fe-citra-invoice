<script setup>
import { useAlertStore } from '@/stores/alert'
import { useCFStore } from '@/stores/cf'
import { navigateTo } from 'nuxt/app'
import { VForm } from 'vuetify/components/VForm'

const cf = useCFStore()
const route = useRoute()
const id = route.params.id
// const addedBarang = cf.addedBarang
let alert = useAlertStore()

const allowedStatus = ['WAITING', 'PROCCESS', 'DONE', 'CANCEL']
const { $api } = useNuxtApp()
await cf.editSuratCF(id)

if (id) {
  try {
    const response = await cf.editSuratCF(id)
    // console.log(response)
    cf.editSurat = response.doc
    cf.insertTempIdEdit()
    // delete cf.editSurat._id
    // delete cf.editSurat.__v
    // delete cf.editSurat.createdAt
    // delete cf.editSurat.updatedAt
  } catch (error) {
    // console.error("Error fetching CF data:", error)
    // alert.showAlertObject({
    //   message: 'Gagal mengambil data CF',
    //   type: 'error',
    // })
    // navigateTo({ name: 'admin-CF' })

  }
}

const store = async () => {
  try {
    // refForm?.value?.validate()
    const valid = await refForm?.value?.validate()
    // console.log(valid)

    if (!valid.valid) { window.scrollTo(0, 0); return }
    if (cf.editSurat.barang.length == 0) throw { message: 'Barang tidak boleh kosong' }

    const response = await cf.updateCF(id)
    // console.log(response)
    alert.showAlertObject({
      message: 'Berhasil Mengubah Surat Citra Furniture',
      type: 'success',
    })
    window.scrollTo(0, 0)

    setTimeout(() => {
      navigateTo({ name: 'admin-CF-detail-id', params: { id: id } })
    }, 4000)

  } catch (error) {
    window.scrollTo(0, 0)
    // console.log(error)
    alert.showAlertObject({
      message: error.message,
      type: 'error',
    })
    // setTimeout(() => {
    //   cf.setAlertNull()
    // }, 4000)
  }
}



function scrollTo(id) {
  const el = document.getElementById(id)
  console.log(el)
  if (el){ 
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const input = el?.querySelector('[name="input-nama-barang"]')
    
    input?.focus()
    input.dispatchEvent(new Event('input', { bubbles: true }))

  }
}
const tambahBarang = () => {
  cf.addBarangEdit()

  console.log(cf.editSurat.barang.length)
  const idItem = `item-${cf.editSurat.barang.length}`
  // scrollTo(idItem)
  setTimeout(() => {
    scrollTo(idItem)
  }, 200);
}
await cf.getConfig()
// await cf.getCFRequestById(id)
const config = cf.config
let rekeningList = config.rekening

const surat = cf.editSurat

let ppnSelection = [
  { title: 'Ya', value: config.ppn },
  { title: 'Tidak', value: 0 },
]

let rekening = {
  title: surat.rekening.atas_nama + ' (' + surat.rekening.nama_bank + ')',
  desc: surat.rekening.no_rekening,
  value: surat.rekening,
  icon: {
    icon: 'tabler-building-bank',
    size: '28',
  },
  current: true,
  tagLine: 'Data Saat Ini',
}
rekeningList.unshift(rekening)
// console.log(rekeningList)
const selectedRadio = ref(surat.rekening)

// // console.log(selectedRadio.value)


const cetak = () => {
  // // console.log(selectedRadio.value)
  surat.atas_nama = selectedRadio.value.atas_nama
  surat.nama_bank = selectedRadio.value.nama_bank
  surat.no_rekening = selectedRadio.value.no_rekening
}


// surat.tempo = selectedTempo
let tempoItems = [
  { title: 'Tempo', value: true },
  { title: 'Sesuai Kesepakatan', value: false },
]
let ongkirItems = [
  { title: 'Ya', value: true },
  { title: 'Tidak', value: false },
]

// const checkTempo = computed(() => {
//   surat.tempo ? surat.tanggal_tempo = '' : surat.catatan_tempo = ''
// })

const changeComma = event => {
  // console.log(event)

  return event.target.value.replace(/,/g, '.')

}

let lists = []
const items = ref([])
let timeout = null

const refForm = ref()

const toDetailPage = () => {
  navigateTo(`/admin/CF/detail/${id}`,)
}

//Testing Code



const res = await $api.get(`/barang/getAll`);
const barangs = res.Barangs

</script>

<template>
  <div>
    <VRow>
    </VRow>
    <VSpacer />
    <VForm ref="refForm" @submit.prevent>
      <VCard class="mt-4">
        <VCardTitle>
          Edit Surat Citra Furniture
        </VCardTitle>
        <Tes />
        <VCardItem>
          <VRow>
            <!-- 👉 First Name -->
            <VCol cols="12" md="6">
              <AppTextField v-model="surat.tujuan" label="Tujuan" placeholder="Tujuan (wajib diisi)" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField v-model="surat.no_hp" label="No. Hp" placeholder="No. Hp (wajib diisi)" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField v-model="surat.hal" label="Hal" placeholder="Hal (wajib diisi)" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField v-model="surat.alamat" label="Alamat (wajib diisi)" placeholder="Alamat (wajib diisi)" :rules="[requiredValidator]" />
            </VCol>

            <!-- 👉 Country -->
            <VCol cols="12" md="6">
              <AppDateTimePicker v-model="surat.tanggal" label="Tanggal (wajib diisi)" placeholder="Pilih Tanggal"
                :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12" md="6">
              <AppSelect v-model="surat.status" :items="allowedStatus" label="Status" placeholder="Pilih Status"
                :rules="[requiredValidator]" />
            </VCol>

            <!-- 👉 Company -->
            <!--
              <VCol cols="12" md="6">
              <AppTextField v-model="surat.company" label="Company" placeholder="Pixinvent" />
              </VCol> 
            -->
          </VRow>
        </VCardItem>
        <VSpacer />
      </VCard>
      <VCard class="mt-4">
        <VRow>
          <VCol cols="12">
            <div class="d-flex justify-space-between">
              <VCardTitle class="ma-2">
                Daftar Barang
              </VCardTitle>
              <VBtn color="primary" @click="tambahBarang" class="ma-3">
                Add
              </VBtn>
            </div>
          </VCol>
        </VRow>
        <VCardItem>
          <VCol cols="12" v-for="(barang, index) in cf.editSurat.barang" :key="barang._tempId" :id="`item-${index+1}`">
            <CFAddBarangEdit :barang="barang" :index="index" :items="barangs" />
          </VCol>
          </VCardItem>
      </VCard>
      <VCard class="mt-4">
        <VCardItem>
          <VRow>
            <VCol cols="12">
              <h2 class="text-lg font-weight-medium">
                Note
              </h2>
            </VCol>
            <!-- 👉 Last Name -->
            <VCol cols="12" md="2">
              <AppSelect v-model="surat.tempo" :items="tempoItems" item-title="title" item-value="value" label="Tempo"
                placeholder="Pilih" @change="checkTempo" />
            </VCol>

            <!-- 👉 Email -->
            <VCol cols="12" md="6">
              <AppDateTimePicker v-if="surat.tempo" v-model="surat.tanggal_tempo" label="Tanggal Jatuh Tempo (wajib diisi)"
                :rules="[requiredValidator]" placeholder="Pilih Tanggal" />
              <AppTextField v-else v-model="surat.catatan_tempo" label="Catatan Tempo (wajib diisi)" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12" md="2">
              <AppSelect v-if="ppnSelection.length > 0" v-model="surat.ppn" label="Termasuk PPN" placeholder="Tujuan"
                :items="ppnSelection" />
            </VCol>
            <VCol cols="12" md="2">
              <AppSelect v-model="surat.ongkos_kirim" label="Termasuk Ongkir" placeholder="Tujuan"
                :items="ongkirItems" />
            </VCol>
            <VCol cols="12" md="2">
              <AppSelect v-model="surat.instalasi" label="Termasuk Instalasi" placeholder="Tujuan"
                :items="ongkirItems" />
            </VCol>
            <!-- 👉 Catatan -->
            <VCol cols="12" md="6">
              <AppTextField v-model="surat.catatan" label="Catatan Invoice" placeholder="Catatan Invoice" />
            </VCol>
            <VCol cols="12">
              <!--
                <VCardText>
                Rekening
                </VCardText> 
              -->
              <FormElementsCustomRadiosWithIcon v-model:selected-radio="surat.rekening" :radio-content="rekeningList"
                :grid-column="{ md: '4', cols: '12' }" title="Pilih Rekening" @change="cetak" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12" class="d-flex gap-4 ">
              <VBtn type="submit" @click="store">
                Submit
              </VBtn>

              <VBtn color="error" @click="toDetailPage()">
                Batal
              </VBtn>
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VForm>
  </div>
</template>
