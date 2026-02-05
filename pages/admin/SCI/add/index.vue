<script setup>
definePageMeta({
  middleware: 'auth',
  head: {
    title: 'Tambah Surat Sentral Citra - Admin',
  },
})

import { useAlertStore } from '@/stores/alert'
import { useSCIStore } from '@/stores/sci'
import { VForm } from 'vuetify/components/VForm'
import {ref, nextTick} from 'vue'
const sci = useSCIStore()
const route = useRoute()
const id = route.params.id
const addedBarang = sci.addedBarang
let alert = useAlertStore()

const { $api } = useNuxtApp()

const store = async () => {
  try {
    // refForm?.value?.validate()
    const valid = await refForm?.value?.validate()
    // // console.log(valid)

    if (!valid.valid) { window.scrollTo(0, 0); return }
    if (sci.addedBarang.length == 0) throw { message: 'Barang tidak boleh kosong' }

    const response = await sci.storeSCI()
    // // console.log(response)
    alert.showAlertObject({
      message: 'Berhasil Menambah Surat Sentral Citra',
      type: 'success',
    })
    window.scrollTo(0, 0)
    // await sci.setStatusRequest(id)
    setTimeout(() => {
      navigateTo({ name: 'admin-SCI' })
    }, 4000)

  } catch (error) {
    window.scrollTo(0, 0)
    // // console.log(error)
    alert.showAlertObject({
      message: error.message,
      type: 'error',
    })
    // setTimeout(() => {
    //   sci.setAlertNull()
    // }, 4000)
  }
}
async function scrollTo(id) {
  await nextTick()
  const el = document.getElementById(id)
  if (el){ 
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const input = el?.querySelector('[name="input-nama-barang"]')
    
    input?.focus()
    input.dispatchEvent(new Event('input', { bubbles: true }))

  }
}
const tambahBarang = () => {
  sci.addBarang()

  console.log(sci.addedBarang.length)
  const idItem = `item-${sci.addedBarang.length}`
  // scrollTo(idItem)
  setTimeout(() => {
    scrollTo(idItem)
  }, 200);
}

await sci.getConfig()
const config = sci.config
const rekeningList = config.rekening

const surat = sci.newSurat

let ppnSelection = [
  { title: 'Ya', value: config.ppn },
  { title: 'Tidak', value: 0 },
]

const selectedRadio = ref()

// // console.log(selectedRadio.value)


const cetak = () => {
  // // // console.log(selectedRadio.value)
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
  // // console.log(event)

  return event.target.value.replace(/,/g, '.')

}


let lists = []
const items = ref([])
let timeout = null

const refForm = ref()

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
          Tambah Surat Sentral Citra
        </VCardTitle>
        <Tes />
        <VCardItem>
          <VRow>
            <!-- 👉 First Name -->
            <VCol cols="12" md="6">
              <AppTextField v-model="surat.tujuan" label="Tujuan (Wajib Diisi)" placeholder="Tujuan" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField v-model="surat.no_hp" label="No Hp (Wajib Diisi)" placeholder="No Hp" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField v-model="surat.alamat" label="Alamat(Wajib Diisi)" placeholder="Alamat" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField v-model="surat.hal" label="Hal (Wajib Diisi)" placeholder="Hal" :rules="[requiredValidator]" />
            </VCol>


            <VCol cols="12" md="6">
              <AppDateTimePicker v-model="surat.tanggal" label="Tanggal (Wajib Diisi)" placeholder="Pilih Tanggal"
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
          <VCol cols="12" md="6">

          </VCol>
        </VRow>
        <VCardItem>
          <!-- <VCol cols="12" offset-md="8" md="4">
          <SCIAddBarang v-for="(barang, index) in sci.addedBarang" :key="index" :barang="barang" :index="index" :items="barangs" />
          </VCol> -->
          <VCol cols="12" v-for="(barang, index) in sci.addedBarang" :key="barang._tempId" :id="`item-${index+1}`" >
            <SCIAddBarang :barang="barang" :index="index" :items="barangs" />
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
              <AppDateTimePicker v-if="surat.tempo" v-model="surat.tanggal_tempo" label="Tanggal Jatuh Tempo (Wajib Diisi)"
                :rules="[requiredValidator]" placeholder="Pilih Tanggal" />
              <AppTextField v-else v-model="surat.catatan_tempo" label="Catatan Tempo (Wajib Diisi)" value="-" :rules="[requiredValidator]" />
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
              <AppTextField v-model="surat.catatan" label="Catatan Invoice (gunakan - jika tidak ada catatan)" placeholder="Catatan Invoice " :rules="[requiredValidator]"/>
            </VCol>
            <VCol cols="12">
              <!--
                <VCardText>
                Rekening
                </VCardText> 
              -->
              <CustomRadiosWithIcon v-model:selected-radio="selectedRadio" :radio-content="rekeningList"
                :grid-column="{ md: '4', cols: '12' }" @change="cetak" :rules="[requiredValidator]" />
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
