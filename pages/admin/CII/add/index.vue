<script setup>
import { useAlertStore } from '@/stores/alert'
import { useCiStore } from '@/stores/ciis'
import { VForm } from 'vuetify/components/VForm'

const cii = useCiStore()
const route = useRoute()
const addedInterior = cii.addedInterior
let alert = useAlertStore()

const { $api } = useNuxtApp()

const store = async () => {
  try {
    // refForm?.value?.validate()
    const valid = await refForm?.value?.validate()
    if (!valid.valid) { window.scrollTo(0, 0); return }
    if (cii.addedInterior.length == 0) throw { message: 'Barang tidak boleh kosong' }

    const response = await cii.storeCII()
    console.log(response)
    alert.showAlertObject({
      message: 'Berhasil Menambah Surat Citra Interior',
      type: 'success',
    })
    window.scrollTo(0, 0)

    setTimeout(() => {
      navigateTo({ name: 'admin-CII' })
    }, 4000)

  } catch (error) {
    window.scrollTo(0, 0)
    console.log(error)
    alert.showAlertObject({
      message: error.message,
      type: 'error',
    })
    // setTimeout(() => {
    //   cii.setAlertNull()
    // }, 4000)
  }
}
function scrollTo(id) {
  const el = document.getElementById(id)
  if (el){ 
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const input = el?.querySelector('[name="input-nama-interior"]')
    
    input?.focus()
    input.dispatchEvent(new Event('input', { bubbles: true }))

  }
}
const tambahBarang = () => {
  
  cii.addInterior()
  console.log(cii.addedInterior.length)
  const idItem = `item-${cii.addedInterior.length}`
  // scrollTo(idItem)
  setTimeout(() => {
    scrollTo(idItem)
  }, 200);
}

await cii.getConfig()
const config = cii.config
const rekeningList = config.rekening

const surat = cii.newSurat

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

//search
const select = ref('')
const loading = ref(false)
const search = ref('')
let lists = []
const items = ref([])
let timeout = null

const refForm = ref()

const fetchUsers = async (query) => {
  loading.value = true;
  if (query.length < 3) return []
  try {
    const res = await $api.get(`/barang/search?keyword=${query}`);
    timeout = setTimeout(() => {
      // console.log(res)
      lists = res.item.map(barang => barang.nama);
      items.value = lists;
      console.log(lists)
    }, 1000);
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    loading.value = false;
  }
  // loading.value = false;
};

watch(search, (query) => {
  if (timeout) clearTimeout(timeout); // Hapus setTimeout sebelumnya

  if (query && query !== select) {
    timeout = setTimeout(() => {
      fetchUsers(query);
    }, 1000); // Tunggu 500ms sebelum request ke API
  }
});

const copyBtn = ref(false)
const copySelected = () => {
  navigator.clipboard.writeText(select.value)
  copyBtn.value = true
  setTimeout(() => {
    copyBtn.value = false
  }, 7000)
}

</script>

<template>
  <div>
    <VRow>
    </VRow>
    <VSpacer />
    <VForm ref="refForm" @submit.prevent>
      <VCard class="mt-4">
        <VCardTitle>
          Tambah Surat Citra Interior
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
            <VCol cols="12" md="6">
              <AppTextField v-model="surat.no_hp" label="No Hp" placeholder="No. Hp" :rules="[requiredValidator]" />
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
        <VRow>
          <VCol cols="12">
            <div class="d-flex justify-space-between">
              <VCardTitle class="ma-2">
                Daftar Interior
              </VCardTitle>
              <VBtn color="primary" @click="tambahBarang" class="ma-3">
                Add
              </VBtn>
            </div>
          </VCol>
          <VCol cols="12" md="6">
<!-- 
            <AppAutocomplete v-model="select" v-model:search="search" :loading="loading" :items="items"
              label="Cari Nama barang" variant="underlined" class="ma-2 pa-2 ma-md-3 pa-md-1"
              :menu-props="{ maxHeight: '200px' }">
              <template #append>
                <VTooltip :model-value="copyBtn" open-on-click :open-on-hover="false" location="top">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" @click="copySelected">
                      tabler-copy
                    </VIcon>
                  </template>
                  <span>Berhasil disalin</span>
                </VTooltip>
              </template>
            </AppAutocomplete> -->

          </VCol>
        </VRow>
        <VCardItem>
          <VCol cols="12" offset-md="8" md="4" />
          <CIIAddInterior v-for="(interior, index) in cii.addedInterior" :key="index" :interior="interior" :index="index" :id="`item-${index+1}`"/>
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
