<script setup>
import { useAlertStore } from '@/stores/alert'
import { useCFStore } from '@/stores/cf'

const cf = useCFStore()

const addedBarang = cf.addedBarang
let alert = useAlertStore()

const store = async () => {
  try {
    const response = await cf.storeCF()

    alert.message = 'Berhasil Menambah Surat Citra Furniture'
    alert.type = 'success'
    alert.show = true
    window.scrollTo(0, 0)

    setTimeout(() => {
      navigateTo({ name: 'admin-CF' })
    }, 4000)

  } catch (error) {
    window.scrollTo(0, 0)
    console.log(error.message)
    alert.message = 'Gagal Menambah Surat Citra Furniture'
    alert.type = 'error'
    alert.show = true
    // setTimeout(() => {
    //   cf.setAlertNull()
    // }, 4000)
  }
}

const tambahBarang = () => {
  cf.addBarang()
}

await cf.getConfig()

const config = cf.config
const rekeningList = config.rekening

const surat = cf.newSurat

let ppnSelection = [
  { title: 'Ya', value: config.ppn },
  { title: 'Tidak', value: 0 },
]

const selectedRadio = ref()

console.log(selectedRadio.value)


const cetak = () => {
  // console.log(selectedRadio.value)
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

const checkTempo = computed(() => {
  surat.tempo ? surat.tanggal_tempo = '' : surat.catatan_tempo = ''
})

const changeComma = event => {
  console.log(event)

  return event.target.value.replace(/,/g, '.')

}


</script>

<template>
  <div>
    <VRow>
    </VRow>
    <VSpacer />
    <VForm @submit.prevent="() => { }">
      <VCard class="mt-4">
        <VCardTitle>
          Tambah Surat Citra Furniture
        </VCardTitle>
        <Tes />
        <VCardItem>
          <VRow>
            <!-- 👉 First Name -->
            <VCol cols="12" md="6">
              <AppTextField v-model="surat.tujuan" label="Tujuan" placeholder="Tujuan" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField v-model="surat.hal" label="Hal" placeholder="Hal" :rules="[requiredValidator]" />
            </VCol>




            <!-- 👉 Country -->
            <VCol cols="12" md="6">
              <AppDateTimePicker v-model="surat.tanggal" label="Tanggal" placeholder="Pilih Tanggal"
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
        <VCardTitle>
          Daftar Barang
          <VBtn color="primary" @click="tambahBarang">
            Add
          </VBtn>
        </VCardTitle>
        <VSpacer />
        <VCardItem>
          <VCol cols="12" offset-md="8" md="4" />
          <CFAddBarang v-for="(barang, index) in cf.addedBarang" :key="index" :barang="barang" :index="index" />
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
              <AppDateTimePicker v-if="surat.tempo" v-model="surat.tanggal_tempo" label="Tanggal Jatuh Tempo"
                :rules="[requiredValidator]" placeholder="Pilih Tanggal" />
              <AppTextField v-else v-model="surat.catatan_tempo" label="Catatan Tempo" :rules="[requiredValidator]" />
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
              <CustomRadiosWithIcon v-model:selected-radio="selectedRadio" :radio-content="rekeningList"
                :grid-column="{ md: '4', cols: '12' }" @change="cetak" />
            </VCol>
            <VCol cols="12" class="d-flex gap-4 ">
              <VBtn type="submit" @click="store">
                Submit
              </VBtn>

              <VBtn type="reset" color="secondary" variant="tonal">
                Reset
              </VBtn>
            </VCol>
          </VRow>
        </VCardItem>
      </VCard>
    </VForm>
  </div>
</template>
