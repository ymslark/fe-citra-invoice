<script setup>
import { useAlertStore } from '@/stores/alert'
import { useCiStore } from '@/stores/ciis'
// import {html2pdf} from 'html2pdf.js'
import { formatRupiah, formatTanggalIndonesia } from '@/utils/format'
import { hitungInvoiceInterior } from '@/utils/invoice/hitungInvoiceInterior'
const cii = useCiStore()
const route = useRoute()
const id = route.params.id
const alert = useAlertStore()

await cii.getConfig()

const showDialog = ref(false)
const showDialogRestore = ref(false)
console.log(id)
try {
  const response = await cii.getCIIById(id)

  console.log(response)
} catch (error) {
  console.log(error)
}
const surat = cii.surat
const listBarang = cii.surat.barang

const ppnSelection = [
  'Ya',
  'Tidak',
]

const radioContent = [
  {
    title: surat.atas_nama + '(' + surat.nama_bank + ')',
    desc: surat.no_rekening,
    value: {
      atas_nama: surat.atas_nama,
      nama_bank: surat.nama_bank,
      no_rekening: surat.no_rekening,
    },
    icon: {
      icon: 'tabler-building-bank',
      size: '28',
    },
  },
]

const selectedRadio = ref('starter')


// surat.tempo = selectedTempo
const tempoItems = [
  { title: 'Ya', value: true },
  { title: 'Tidak', value: false },
]

// const checkTempo = computed(() => {
//   surat.tempo ? surat.tanggal_tempo = '' : surat.catatan_tempo = ''
// })

const anu = false

const toEditPage = computed(() => {
  navigateTo(`/admin/CII/edit/${id}`)
})


const deleteCII = async () => {
  if (id) {
    try {
      await cii.deleteCII(id)
      alert.showAlertObject({
        message: 'Surat berhasil dihapus',
        type: 'success',
      })
      navigateTo({ name: 'admin-CII' })
    } catch (error) {
      console.error('Error deleting memo:', error)
      alert.showAlertObject({
        message: 'Gagal menghapus Surat',
        type: 'error',
      })
    }
  } else {
    alert.showAlertObject({
      message: 'ID Surat tidak ditemukan',
      type: 'error',
    })
  }
}
const restoreCII = async () => {
  if (id) {
    try {
      await cii.restoreCII(id)
      alert.showAlertObject({
        message: 'Surat berhasil di-restore',
        type: 'success',
      })
      cii.surat.isActive = true
      showDialogRestore.value = false
      // navigateTo({ name: 'admin-CII-detail-id', params: { id } })
    } catch (error) {
      console.error('Error deleting memo:', error)
      alert.showAlertObject({
        message: 'Gagal me-restore Surat',
        type: 'error',
      })
    }
  } else {
    alert.showAlertObject({
      message: 'ID Surat tidak ditemukan',
      type: 'error',
    })
  }
}
// const downloadPDF = () => {
//   const element = document.getElementById('print-area')
//   const options = {
//     margin: 0.5,
//     filename: 'invoice.pdf',
//     image: { type: 'jpeg', quality: 0.98 },
//     html2canvas: { scale: 2 },
//     jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
//   }

//   html2pdf().set(options).from(element).save()
// }

let interiors = hitungInvoiceInterior(surat.interior, surat.ppn)
console.log(interiors)
</script>

<template>
  <div>
    <VForm @submit.prevent="() => { }">
      <VRow>
        <VCol cols="12" md="6" order-md="1" order="2" class="">
          <VCard class="mb-md-6 mb-3 d-md-none" >
            <VCardItem>
  
            <div class="d-flex direction-row gap-3 flex-wrap justify-center">
              <VBtn color="primary" @click="toEditPage()">
                Edit
                <VTooltip open-on-focus location="top" activator="parent">
                  Edit Surat
                </VTooltip>
                <VIcon end icon="tabler-edit"/>
              </VBtn>
              <VBtn color="info" @click="navigateTo(`/admin/CII/print/surat?id=${id}`)" class="d-none d-md-inline-block">
>
                Print Surat
                <VTooltip open-on-focus location="top" activator="parent">
                  Print Surat Penawaran
                </VTooltip>
                <VIcon end icon="tabler-printer"/>
              </VBtn>
              <VBtn color="secondary" @click="navigateTo(`/admin/CII/print/invoice?id=${id}`)"  class="d-none d-md-inline-block">
                Print Invoice
                <VTooltip open-on-focus location="top" activator="parent">
                  Print Invoice
                </VTooltip>
                <VIcon end icon="tabler-invoice"/>
              </VBtn>
              <VBtn color="warning"
              @click="navigateTo(`/admin/memo/add?id=${id}&perusahaan=${cii.perusahaan}`)">
                Buat Surat Jalan
                <VTooltip open-on-focus location="top" activator="parent">
                  Buat Surat jalan
                </VTooltip>
                <VIcon end icon="tabler-truck"/>
              </VBtn>
              <VBtn v-if="surat.isActive" color="error" @click="showDialog = true">
                Hapus Surat
                <VTooltip open-on-focus location="top" activator="parent">
                  Hapus Surat
                </VTooltip>
                <VIcon end icon="tabler-trash" />
              </VBtn>
              <VBtn v-else color="success" @click="showDialogRestore = true">
                Restore Surat
                <VTooltip open-on-focus location="top" activator="parent">
                  Restore Surat
                </VTooltip>
                <VIcon>tabler-restore</VIcon>
              </VBtn>
              <UtilsConfirmDialog :show="showDialog" message="Apakah Anda Yakin Ingin menghapus surat ini??"
                @confirm="deleteCII" @cancel="showDialog = false" />
              <UtilsConfirmDialog :show="showDialogRestore" message="Apakah Anda Yakin Ingin me-restore surat ini??"
                title="Restore Surat" @confirm="restoreCII" @cancel="showDialogRestore = false" />              
            </div>      
  
            </VCardItem>
          </VCard>
          <VCard>
            <VCardTitle>
              Detail Surat Citra Interior
            </VCardTitle>
            <VCardItem>
              <VRow>
                <!-- 👉 First Name -->
                <VCol cols="12">
                  <AppTextField v-model="surat.tujuan" label="Tujuan" placeholder="Tujuan" :rules="[requiredValidator]"
                    readonly />
                </VCol>
                <VCol cols="12">
                  <AppTextField v-model="surat.no_hp" label="No. Hp" placeholder="No. Hp"
                  readonly />
                </VCol>
                <VCol cols="12">
                  <AppTextField v-model="surat.alamat" label="Alamat" placeholder="Alamat"
                  readonly />
                </VCol>
                <VCol cols="12">
                  <AppTextField v-model="surat.no_seri" label="Nomor Seri" placeholder="No.Seri" :rules="[requiredValidator]"
                    readonly />
                </VCol>
                <VCol cols="12">
                  <AppTextField v-model="surat.hal" label="Hal" placeholder="Hal" :rules="[requiredValidator]"
                    readonly />
                </VCol>


                <!-- 👉 Catatan -->
                <VCol cols="12">
                  <AppTextField v-model="surat.catatan" label="Catatan Invoice" placeholder="Catatan Invoice"
                    readonly />
                </VCol>

                <!-- 👉 Country -->
                <VCol cols="12">
                  <AppTextField v-model="surat.tanggal" label="Tanggal" placeholder="Pilih Tanggal" readonly />
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
        </VCol>
        <VCol cols="12" md="6" order="3" >
          <VCard class="mb-md-3 mb-3 d-none d-md-block" >
            <VCardItem>
  
            <div class="d-flex direction-row gap-3 flex-wrap justify-center">
              <VBtn color="primary" @click="toEditPage()">
                Edit
                <VTooltip open-on-focus location="top" activator="parent">
                  Edit Surat
                </VTooltip>
                <VIcon end icon="tabler-edit"/>
              </VBtn>
              <VBtn color="info" @click="navigateTo(`/admin/CII/print/surat?id=${id}`)">
                Print Surat
                <VTooltip open-on-focus location="top" activator="parent">
                  Print Surat Penawaran
                </VTooltip>
                <VIcon end icon="tabler-printer"/>
              </VBtn>
              <VBtn color="secondary" @click="navigateTo(`/admin/CII/print/invoice?id=${id}`)">
                Print Invoice
                <VTooltip open-on-focus location="top" activator="parent">
                  Print Invoice
                </VTooltip>
                <VIcon end icon="tabler-invoice"/>
              </VBtn>
              <VBtn color="warning"
              @click="navigateTo(`/admin/memo/add?id=${id}&perusahaan=${cii.perusahaan}`)">
                Buat Surat Jalan
                <VTooltip open-on-focus location="top" activator="parent">
                  Buat Surat Jalan
                </VTooltip>
                <VIcon end icon="tabler-truck"/>
              </VBtn>
              <!-- <VBtn color="warning"
              @click="navigateTo(`/admin/memo/add?id=${id}&perusahaan=${cii.perusahaan}`)">
                Buat Surat Permintaan Faktur Pajak
                <VTooltip open-on-focus location="top" activator="parent">
                  Buat Surat Permintaan Faktur Pajak
                </VTooltip>
                <VIcon end icon="tabler-truck"/>
              </VBtn> -->
              <VBtn v-if="surat.isActive" color="error" @click="showDialog = true">
                Hapus Surat
                <VTooltip open-on-focus location="top" activator="parent">
                  Hapus Surat
                </VTooltip>
                <VIcon end icon="tabler-trash" />
              </VBtn>
              <VBtn v-else color="success" @click="showDialogRestore = true">
                Restore Surat 
                <VTooltip open-on-focus location="top" activator="parent">
                  Restore Surat
                </VTooltip>
                <VIcon>tabler-restore</VIcon>
              </VBtn>
              <UtilsConfirmDialog :show="showDialog" message="Apakah Anda Yakin Ingin menghapus surat ini??"
                @confirm="deleteCII" @cancel="showDialog = false" />
              <UtilsConfirmDialog :show="showDialogRestore" message="Apakah Anda Yakin Ingin me-restore surat ini??"
                title="Restore Surat" @confirm="restoreCII" @cancel="showDialogRestore = false" />              
            </div>
            </VCardItem>
          </VCard>
          <VCard>
            <VCardTitle>
              <h2 class="text-lg font-weight-medium">
                Note
              </h2>
            </VCardTitle>
            <VCardItem class="pa-0 ma-0">
              <VList>
                <VListItem>
                  1. Harga {{ surat.ppn == 0 ? 'Tidak' : '' }} Termasuk PPN <span v-if="surat.ppn>0"> {{ surat.ppn }}%</span>
                </VListItem>
                <VListItem>
                  2. Harga {{ !surat.ongkir ? 'Tidak' : '' }} Termasuk Ongkir
                </VListItem>
                <VListItem>
                  3. Tempo Pembayaran {{ surat.tempo ? `Hingga ${formatTanggalIndonesia(surat.tanggal_tempo)}`
                    : 'Sesuai Kesepakatan' }}
                  <p v-if="!surat.tempo">
                    Catatan : {{ surat.catatan_tempo }}
                  </p>
                </VListItem>
                <VListItem>
                  4. Pembayaran harap di transfer melalui rekening :
                  <VSpacer />
                  <VList>
                    <VListItem>
                      Atas Nama : {{ surat.rekening.atas_nama }}
                    </VListItem>
                    <VListItem>
                      Bank : {{ surat.rekening.nama_bank }}
                    </VListItem>
                    <VListItem>
                      Rekening : {{ surat.rekening.no_rekening }}
                    </VListItem>
                  </VList>
                </VListItem>
              </VList>
            </VCardItem>
          </VCard>

        </VCol>
      </VRow>
      <VCard class="mt-4">
        <VCardTitle>
          Daftar Barang
        </VCardTitle>
        <VSpacer />
        <VCardItem>
          <VCol cols="12" offset-md="8" md="4" />
          <VCol cols="12">
            <VTable fixed-header class="text-no-wrap">
              <thead>
                <!-- <tr>
                  <th class="text-uppercase">
                    No.
                  </th>
                  <th class="text-uppercase">
                    Nama Barang
                  </th>
                  <th class="text-uppercase">
                    ukuran
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
                    Total Harga
                  </th>
                  <th class="text-uppercase">
                    Total Diskon
                  </th>
                  <th class="text-uppercase">
                    Harga Akhir
                  </th>
                </tr> -->
                <tr>
                  <th class="text-uppercase">
                    No.
                  </th>
                  <th class="text-uppercase">
                    Nama Interior
                  </th>
                  <th class="text-uppercase">
                    Harga per Meter
                  </th>
                  <th class="text-uppercase">
                    Diskon Nominal
                  </th>
                  <th class="text-uppercase">
                    Diskon Persen
                  </th>
                  <th class="text-uppercase">
                    Diskon
                  </th>
                  <th class="text-uppercase">
                    Ukuran
                  </th>
                  <th class="text-uppercase">
                    Harga Akhir
                  </th>
                  <!-- <th class="text-uppercase">
                    Total Harga
                  </th> -->
                  <th class="text-uppercase">
                    Total
                  </th>
                </tr>
              </thead>

              <!-- <tbody>
                <tr v-for="(item, index) in surat.interior" :key="index">
                  <td>
                    {{ index + 1 }}
                  </td>
                  <td>
                    {{ item.nama_interior }}
                  </td>
                  <td>
                    {{ item.v1 }} x {{ item.v2 }}m
                  </td>
                  <td>
                    Rp{{ formatRupiah(item.harga) }}
                  </td>
                  <td>
                    {{ item.diskon_nominal }}
                  </td>
                  <td>
                    {{ item.diskon_persen }}%
                  </td>
                  <td>
                    Rp{{ formatRupiah(item.total_harga) }}
                  </td>
                  <td>
                    Rp{{ formatRupiah(item.total_diskon) }}
                  </td>
                  <td>
                    Rp{{ formatRupiah(item.harga_akhir) }}
                  </td>
                </tr>


                <tr>
                  <td colspan="7" />
                  <td class="text-bold">
                    Total
                  </td>
                  <td>Rp{{ formatRupiah(surat.total_harga) }}</td>
                </tr>
                <tr>
                  <td colspan="7" />
                  <td class="text-bold">
                    Total Diskon
                  </td>
                  <td>Rp{{ formatRupiah(surat.total_diskon) }}</td>
                </tr>

                <tr v-if="surat.ppn > 0">
                  <td colspan="7" />
                  <td class="text-bold">
                    PPN {{ surat.ppn }}%
                  </td>
                  <td>Rp{{ formatRupiah(Math.ceil((surat.harga_akhir * surat.ppn) / 100 / 1000) * 1000) }}</td>
                </tr>

                <tr>
                  <td colspan="7" />
                  <td class="text-bold">
                    Harga Akhir
                  </td>
                  <td>
                    Rp{{ formatRupiah(surat.harga_akhir + Math.ceil((surat.harga_akhir * surat.ppn) / 100 / 1000) *
                      1000) }}
                  </td>
                </tr>
              </tbody> -->
              <tbody>
                <tr v-for="(item, index) in surat.interior" :key="index">
                  <td>
                    {{ index + 1 }}
                  </td>
                  <td>
                    {{ item.nama_interior }}
                  </td>
                  <!-- <td>
                    Rp{{ formatRupiah(item.harga) }}
                  </td> -->
                  <td>
                    Rp{{ formatRupiah(item.harga) }}
                  </td>
                  <td>
                    Rp{{ formatRupiah(item.diskon_nominal) }}
                  </td>
                  <td>
                    {{ item.diskon_persen }}%
                  </td>
                  <td>
                    Rp{{ formatRupiah(item.diskon) }}
                  </td>
                  <td>
                    {{ item.v1 }}x{{ item.v2 }}m<sup>3</sup>
                  </td>
                  <td>
                    Rp{{ formatRupiah((item.harga_akhir - (item.harga_akhir * (surat.ppn/100) ) )) }}
                  </td>
                  <td>
                    Rp{{ formatRupiah(item.total_harga_akhir - (item.total_harga_akhir * (surat.ppn/100) ) ) }}
                  </td>
                </tr>


                <tr>
                  <td colspan="7" />
                  <td class="text-bold">
                    Total
                  </td>
                  <td>Rp{{ formatRupiah(surat.total_harga_awal) }}</td>
                </tr>
                <tr>
                  <td colspan="7" />
                  <td class="text-bold">
                    Total Diskon
                  </td>
                  <td>Rp{{ formatRupiah(surat.total_diskon) }}</td>
                </tr>
                <!-- <tr>
                  <td colspan="7" />
                  <td class="text-bold">
                    SubTotal
                  </td>

                  <td>Rp{{formatRupiah( surat.harga_akhir * ((100-surat.ppn)/100) )}}</td>
                </tr> -->
                <tr v-if="surat.ppn > 0">
                  <td colspan="7" />
                  <td class="text-bold">
                    PPN {{ surat.ppn }}%
                  </td>
                  <!-- <td>Rp{{ formatRupiah((surat.harga_akhir * surat.ppn) / 100 / 1000 * 1000) }}</td> -->
                  <td>Rp{{formatRupiah( surat.harga_akhir * (surat.ppn/100)  )}}</td>
                </tr>

                <tr>
                  <td colspan="7" />
                  <td class="text-bold">
                    SUBTOTAL
                  </td>
                  <!-- <td>
                    Rp{{ formatRupiah(surat.harga_akhir - (surat.harga_akhir * surat.ppn) / 100 / 1000 *
                      1000) }}
                  </td> -->
                  <td>Rp{{formatRupiah( (surat.harga_akhir * (surat.ppn/100)) + (surat.harga_akhir * ((100-surat.ppn)/100))  )}}</td>
                </tr>
              </tbody>              
            </VTable>
          </VCol>
        </VCardItem>
      </VCard>
      <VRow />
    </VForm>
  </div>
  <!-- <div class="print-area">
    <CIIPrintInvoice :surat="surat" />
  </div> -->
</template>
