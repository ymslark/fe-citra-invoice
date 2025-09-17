<script setup>
import { useMyCFStore } from '@/stores/cf.js'

const cf = useMyCFStore()
const addedBarang = cf.addedBarang
const route = useRoute('apps-CF-detail-id')

// const addedBarang = ref([])

const tambahBarang = () => {
  cf.addBarang()
}

let ppn = 0
let ongkir = true

const total_harga = computed(() => {
  let total = 0
  for (let i = 0; i < cf.listBarang.length; i++) {
    total += cf.listBarang[i].harga * cf.listBarang[i].qty
  }
  return total
})

const total_diskon = computed(() => {
  let total = 0
  for (let i = 0; i < cf.listBarang.length; i++) {
    total += cf.listBarang[i].diskon_nominal
  }
  return total
})

const harga_akhir = computed(() => {
    let total = 0
    for (let i = 0; i < cf.listBarang.length; i++) {
      total += cf.listBarang[i].harga * cf.listBarang[i].qty - cf.listBarang[i].diskon_nominal
    }
      return total
    })
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

const changeComma = (event) => {
  console.log(event)
  return event.target.value.replace(/,/g, '.')

  }
</script>

<template>
  <div>
    <VForm @submit.prevent="() => {}">
      <VCard>
        <VCardTitle>
          Tambah Surat Citra Furniture 
        </VCardTitle>
        <VCardText>
          <template #append>
            <div class="mt-n4 me-n2">
              <MoreBtn :menu-list="moreList" />
            </div>
          </template>
        </VCardText>
        <VCardItem>
          <VRow>
            <!-- 👉 First Name -->
            <VCol cols="12" md="6">
              <AppTextField v-model="surat.tujuan" label="Tujuan" placeholder="Tujuan" :rules="[requiredValidator]" readonly />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField v-model="surat.hal" label="Hal" placeholder="Hal" :rules="[requiredValidator]" readonly/>
            </VCol>


            <!-- 👉 Catatan -->
            <VCol cols="12" md="6">
              <AppTextField v-model="surat.catatan" label="Catatan Invoice" placeholder="Catatan Invoice" />
            </VCol>

            <!-- 👉 Country -->
            <VCol cols="12" md="6">
              <AppDateTimePicker v-model="surat.tanggal" label="Tanggal" placeholder="Pilih Tanggal" :rules="[requiredValidator]" />
            </VCol>

            <!-- 👉 Company -->
            <!-- <VCol cols="12" md="6">
              <AppTextField v-model="surat.company" label="Company" placeholder="Pixinvent" />
            </VCol> -->
          </VRow>
        </VCardItem>
        <VSpacer />
      </VCard>
      <VCard class="mt-4">
        <VCardTitle>
          Daftar Barang
        </VCardTitle>
        <VSpacer />
        <VCardItem>
          <VCol cols="12" offset-md="8" md="4">
          </VCol>
          <VCol cols="12">
            <VTable
              fixed-header
              class="text-no-wrap"
            >
              <thead>
                <tr>
                  <th class="text-uppercase">
                    No.
                  </th>
                  <th class="text-uppercase">
                    Nama Barang
                  </th>
                  <th class="text-uppercase">
                    qty
                  </th>
                  <th class="text-uppercase">
                    Harga
                  </th>
                  <th class="text-uppercase">
                    Diskon Nominal
                  </th>
                  <th class="text-uppercase">
                    Diskon Persen
                  </th>
                  <th class="text-uppercase">
                    Harga Akhir
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(item,index) in cf.listBarang"
                  :key="index" 
                >
                  <td>
                    {{ index + 1 }}
                  </td>
                  <td>
                    {{ item.nama_barang }}
                  </td>
                  <td>
                    {{ item.qty }}
                  </td>
                  <td>
                    Rp{{ item.harga }}
                  </td>
                  <td>
                    {{ item.diskon_nominal }}
                  </td>
                  <td>
                    Rp{{ item.diskon_persen }}%
                  </td>
                  <td>
                    Rp{{ item.harga * item.qty - item.diskon_nominal }}
                    
                  </td>
                </tr>
                <tr>
                  <td colspan="6" class="text-end">Total</td>
                  <td>Rp{{ total_harga.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.") }}</td>
                </tr>
                <tr>
                  <td colspan="6" class="text-end">Total Diskon</td>
                  <td>Rp{{ total_diskon.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.") }}</td>
                </tr>
                <tr>
                  <td colspan="6" class="text-end">PPN 11%</td>
                  <td>Rp{{ (harga_akhir / 100 * 11).toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.") }}</td>
                </tr>
                <tr>
                  <td colspan="6" class="text-end">Harga Akhir</td>
                  <td>Rp{{ (harga_akhir + harga_akhir / 100 * 11).toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1\.") }}</td>
                </tr>
              </tbody>
            </VTable>
          </VCol>
        </VCardItem>
      </VCard>
      <VRow>
        <VCol cols="12" md="4" offset-md="4">
          <VCard class="mt-4">
            <VCardItem>
              <VRow>
                <VCol cols="12">
                  <VCardTitle>
                    <h2 class="text-lg font-weight-medium">
                      Note
                    </h2>
                  </VCardTitle>
                </VCol>
                <!-- 👉 Last Name -->
                <!-- <VCol cols="12" md="2">
                  <AppSelect 
                    v-model="surat.tempo" 
                    :items="tempoItems" 
                    item-title="title" 
                    item-value="value" 
                    label="Tempo" 
                    placeholder="Pilih" 
                    @change="checkTempo" />
                </VCol> -->
    
                <!-- 👉 Email -->
                <!-- <VCol cols="12" md="6">
                  <AppDateTimePicker v-if="surat.tempo" v-model="surat.tanggal_tempo" label="Tanggal Jatuh Tempo"
                    :rules="[requiredValidator]" placeholder="Pilih Tanggal" />
                  <AppTextField v-else v-model="surat.catatan_tempo" label="Catatan Tempo"
                    :rules="[requiredValidator]" />
                </VCol>
                <VCol cols="12" md="2">
                  <AppSelect v-model="surat.ppn" label="Termasuk PPN" placeholder="Tujuan" :items="ppnSelection" />
                </VCol>
                <VCol cols="12" md="2">
                  <AppSelect v-model="surat.ongkos_kirim" label="Termasuk Ongkir" placeholder="Tujuan" :items="ppnSelection"
                    readonly />
                </VCol> -->
                <!-- <VCol cols="12">
                  <CustomRadiosWithIcon 
                    v-model:selected-radio="selectedRadio" 
                    :radio-content="radioContent"
                    @change="cetak"
                    :grid-column="{ md: '4', cols: '12' }" readonly/>
                    <VCardText>
                      <div class="d-flex align-center gap-x-4 mb-2">
                        <VAvatar
                          variant="tonal"
                          color="primary"
                          rounded
                        >
                          <VIcon
                            :icon="tabler-building-bank"
                            size="28"
                          />
                        </VAvatar>
                        <h5 class="text-h5 font-weight-medium">
                          dgfdg
                        </h5>
                      </div>
                      <div class="text-body-1">
                        fgdfg
                      </div>
                    </VCardText>
                </VCol> -->
                <VCol cols="12">
                  <VCardItem>
                    <VList>
                      <VListItem>
                        1. Harga {{ ppn == 0 ? 'Tidak' : '' }} Termasuk PPN
                      </VListItem>
                      <VListItem>
                        2. Harga {{ !ongkir ? 'Tidak' : '' }} Termasuk Ongkir
                      </VListItem>
                      <VListItem>
                        3. Pembayaran Sesuai Kesepakatan
                      </VListItem>
                      <VListItem>
                        4. Pembayaran harap di transfer melalui rekening :
                        <VSpacer/>
                        <VList>
                          <VListItem>
                            Atas Nama : 
                          </VListItem>
                          <VListItem>
                            Bank : 
                          </VListItem>
                          <VListItem>
                            Rekening : 
                          </VListItem>
                        </VList>
                      </VListItem>
                      <VListItem>
                        1. Harga {{ ppn == 0 ? 'Tidak' : '' }} Termasuk PPN
                      </VListItem>
                    </VList>
                  </VCardItem>
                </VCol>
              </VRow>
            </VCardItem>
          </VCard>
        </VCol>
      </VRow>
    </VForm>
  </div>
</template>


