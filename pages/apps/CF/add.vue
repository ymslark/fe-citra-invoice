<script setup>
import { useMyCFStore } from '@/stores/cf.js'

const cf = useMyCFStore()
const addedBarang = cf.addedBarang

// const addedBarang = ref([])

const tambahBarang = () => {
  cf.addBarang()
}

const surat = cf.newSurat

const ppnSelection = [
  'Ya',
  'Tidak',
]

const radioContent = [
  {
    title: 'ASAs (BCA)',
    desc: '1231231241243123',
    value: {
      atas_nama: 'Asas',
      nama_bank: 'BCA',
      no_rekening: 32123123123,
    },
    icon: {
      icon: 'tabler-building-bank',
      size: '28',
    },
  },
  {
    title: 'SAHSA (BCA)',
    desc: '2341234123123',
    value: {
      atas_nama: 'SAHSA',
      nama_bank: 'BCA',
      no_rekening: 32123123123,
    },
    icon: {
      icon: 'tabler-building-bank',
      size: '28',
    },
  },
  {
    title: 'asjhsjahj (BCA)',
    desc: '23423412',
    value: 'enterprise',
    icon: {
      icon: 'tabler-building-bank',
      size: '28',
    },
  },
]

const selectedRadio = ref('starter')

const cetak = () => {
  console.log(selectedRadio.value)
  surat.atas_nama = selectedRadio.value.atas_nama
  surat.nama_bank = selectedRadio.value.nama_bank
  surat.no_rekening = selectedRadio.value.no_rekening
}


// surat.tempo = selectedTempo
const tempoItems = [
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
    <VForm @submit.prevent="() => { }">
      <VCard>
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


            <!-- 👉 Catatan -->
            <VCol cols="12" md="6">
              <AppTextField v-model="surat.catatan" label="Catatan Invoice" placeholder="Catatan Invoice" />
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
          <CFAddBarang v-for="(barang, index) in addedBarang" :key="index" :barang="barang" :index="index" />
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
              <AppSelect v-model="surat.ppn" label="Termasuk PPN" placeholder="Tujuan" :items="ppnSelection" />
            </VCol>
            <VCol cols="12" md="2">
              <AppSelect v-model="surat.ongkos_kirim" label="Termasuk Ongkir" placeholder="Tujuan" :items="ppnSelection"
                readonly />
            </VCol>
            <VCol cols="12">
              <CustomRadiosWithIcon v-model:selected-radio="selectedRadio" :radio-content="radioContent"
                :grid-column="{ md: '4', cols: '12' }" @change="cetak" />
            </VCol>
            <VCol cols="12" class="d-flex gap-4 ">
              <VBtn type="submit">
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
