<script setup>
definePageMeta({
  layout: 'print',
  backgroundColor: '#FFFFFF'
})
defineProps({
  surat: {
    type: object,
    required: true}
})
// import { useAlertStore } from '@/stores/alert'
// import { useCFStore } from '@/stores/cf'
// import { formatRupiah, formatTanggalIndonesia, pembilang } from '@/utils/format'
// import { getDate } from '@/utils/global'
// const route = useRoute()
// const router = useRouter()
// const cf = useCFStore()
// const id = route.query.id || null
// const alert = useAlertStore()

if (!id) {
  alert.showAlert({
    type: 'error',
    message: 'Tidak ada Id',
    timeout: 3000
  })
  console.error('ID tidak ditemukan')
  navigateTo({ name: 'admin-CF' })
}
// let surat = null
// try {
//   const response = await cf.getCFById(id)
//   surat = response.doc
//   console.log(surat)
//   // console.log(surat.doc)
// } catch (error) {
//   alert.showAlert({
//     type: 'error',
//     message: 'Gagal mengambil data surat',
//   })
// }

surat['total'] = surat.barang.reduce((sum, item) => sum + item.total_harga, 0);
surat['total_diskon'] = surat.barang.reduce((sum, item) => sum + item.total_diskon, 0);
surat['harga_akhir'] = surat.barang.reduce((sum, item) => sum + item.harga_akhir, 0);
surat['total_ppn'] = surat.harga_akhir * (surat.ppn / 100);
surat['subtotal'] = surat.harga_akhir + surat.total_ppn
console.log(surat)
// "total_harga": 1560000,
//   "total_diskon": 156000,
//     "harga_akhir": 1404000
// try {
//   const response = await cf.getCFById(id)

//   console.log(response)
// } catch (error) {
//   console.log(error)
// }
// const surat = cf.surat
// const listBarang = cf.surat.barang
onMounted(() => {
  if(process.client){
    document.title = 'Invoice ' + surat.tujuan + ' - Citra Furniture'
    setTimeout(() => {
      window.print()
    }, 1000)
      // window.addEventListener('afterprint', () => {
      //   // window.location.replace('/admin/CF/detail/' + id)
      //   window.location.href = '/admin/CF/detail/' + id
      //   // this.$router.push(`/admin/CF`)  // Gantilah dengan tujuan kamu
      // })
  }
})
</script>

<template>
  <div class="header">
    <img class="kop-img" src="/images/citragroup/cf/CF_Kop.png" alt="" srcset="">
  </div>

  <!-- box -->
  <div class="box">
    <h1 class="title">PROFORMA INVOICE</h1>
    <div class="tujuan">
      <div>Kepada Yth.</div>
      <div id="tujuan-text">{{ surat.tujuan }}</div>
    </div>
    <div class="detail-invoice">
      <div>Mata Uang : Rupiah</div>
      <div>No. Po: {{ surat.no_seri }}</div>
      <div>Tanggal PO : {{ formatTanggalIndonesia(surat.tanggal, 'hari') }}</div>
    </div>

    <table class="table-items">
      <thead>
        <tr>
          <th style="width:4%;" class="bl-0">No</th>
          <th style="width:51%;">Keterangan</th>
          <th style="width:5%;">Qty</th>
          <th style="width:20%;">Harga Satuan</th>
          <th style="width:20%;" class="br-0">Total Harga</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in surat.barang" :key="index">
          <td class="text-center bl-0">{{ index + 1 }}</td>
          <td class="text-uppercase">{{ item.nama_barang }}</td>
          <td class="text-center">{{ item.qty }}</td>
          <td class="text-right">{{ formatRupiah(item.harga) }}</td>
          <td class="text-right br-0">{{ formatRupiah(item.total_harga) }}</td>
        </tr>

        <tr>
          <td colspan="3" class="bl-0 br-0"></td>
          <td class="bl-0 m-left-detail">Total</td>
          <td class="text-right br-0">{{ formatRupiah(surat.total) }}</td>
        </tr>
        <tr>
          <td colspan="3" class="bl-0 br-0"></td>
          <td class="bl-0 m-left-detail">DISKON</td>
          <td class="text-right br-0">{{ formatRupiah(surat.total_diskon) }}</td>
        </tr>
        <tr v-if="surat.ppn > 0">
          <td colspan="3" class="bl-0 br-0"></td>
          <td class="bl-0 m-left-detail">PPN 11%</td>
          <td class="text-right br-0">{{ formatRupiah(surat.total_ppn) }}</td>
        </tr>
        <tr>
          <td colspan="3" class="bl-0 br-0"></td>
          <td class="bl-0 m-left-detail"><b>SUBTOTAL</b></td>
          <td class="text-right br-0">{{ formatRupiah(surat.harga_akhir) }}</td>
        </tr>
        <tr>
          <td class="bl-0 terbilang br-0 m font-normal" colspan="5">Terbilang: {{ pembilang(surat.harga_akhir) }}</td>
        </tr>
        <tr>
          <td class="bl-0 br-0 m-left font-normal" colspan="5">
            <span>Note:</span>
            <ol id="note-list">
              <li v-if="surat.ppn > 0" >Harga Termasuk PPN</li>
              <li v-else>Harga Tidak Termasuk PPN</li>
              <li v-if="surat.ongkos_kirim && surat.instalasi">Harga Sudah Termasuk Ongkos Kirim & Sudah Termasuk Biaya
                Instalasi</li>
              <li v-else-if="surat.instalasi">Harga Sudah Termasuk Biaya Instalasi</li>
              <li v-else-if="surat.ongkos_kirim">Harga Sudah Termasuk Biaya Ongkos Kirim</li>
              <li v-for="(note, index) in surat.catatan" :key="index">{{note}}</li>
              <li>Pembayaran Via Transfer</li>
            </ol>
          </td>
        </tr>
      </tbody>
    </table>
    <table id="info-akhir" class="font-normal">
      <tr>
        <td class="bl-0">
          <strong style="margin-bottom:20px;">KETERANGAN</strong>
          <div>Pembayaran untuk invoice ini mohon di transfer ke rekening:</div>
          <table class="rekening">
            <tr>
              <td>Atas Nama</td>
              <td>:</td>
              <td>{{ surat.rekening.atas_nama }}</td>
            </tr>
            <tr>
              <td>No. Rekening</td>
              <td>:</td>
              <td>{{ surat.rekening.no_rekening }}</td>
            </tr>
            <tr>
              <td>Bank</td>
              <td>:</td>
              <td>{{ surat.rekening.nama_bank }}</td>
            </tr>
          </table>
        </td>
        <td class="br-0">
          <div>Bekasi, {{ formatTanggalIndonesia(getDate(), 'hari') }}</div>
          <img src="/images/citragroup/cf/CF_Logo.png" id="logo">
          <div>Citra Furniture Indonesia</div>
        </td>
      </tr>
    </table>

  </div>
  <!-- box -->


  <!-- <table>
    <thead>
      <tr>
        <th>No</th>
        <th>Keterangan</th>
        <th>Qty</th>
        <th>Harga</th>
        <th>Total Harga</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center">1</td>
        <td>LOKER BESI 18 PINTU KUNCI | LOCKER KARYAWAN</td>
        <td class="text-center">3</td>
        <td class="text-right">Rp2.150.000</td>
        <td class="text-right">Rp6.450.000</td>
      </tr>
      <tr>
        <td class="text-center">2</td>
        <td>ONGKOS KIRIM JAKARTA</td>
        <td class="text-center">1</td>
        <td class="text-right">Rp100.000</td>
        <td class="text-right">Rp100.000</td>
      </tr>
      <tr>
        <td colspan="4" class="text-right"><strong>Total</strong></td>
        <td class="text-right"><strong>Rp6.550.000</strong></td>
      </tr>
      <tr>
        <td colspan="4" class="text-right"><strong>SUBTOTAL</strong></td>
        <td class="text-right"><strong>Rp6.550.000</strong></td>
      </tr>
    </tbody>
  </table>

  <div><strong>Terbilang:</strong> Enam Juta Lima Ratus Lima Puluh Ribu Rupiah</div>

  <div class="note">
    <p><strong>Note:</strong></p>
    <ul>
      
    </ul>
  </div>

  <table class="no-border">
    <tr><td colspan="2"><strong>Keterangan</strong></td></tr>
    <tr><td colspan="2">Pembayaran Untuk Invoice ini mohon ditransfer ke Rekening:</td></tr>
    <tr><td>A.n</td><td>: William Prayogo</td></tr>
    <tr><td>No. Rekening</td><td>: 7035622888</td></tr>
    <tr><td>Bank</td><td>: BCA</td></tr>
  </table>

  <div class="signature">
    <p>Bekasi, Rabu 18 Juni 2025</p>
    <br><br><br>
    <p><strong>Hormat Kami</strong><br>Citra Furniture Indonesia</p>
  </div> -->


</template>
<style scoped>
@media screen {
  .VLocaleProvider {
    all: unset !important;
  }

  .VApp {
    all: unset !important;
  }

  body {
    margin: 0 !important;
    padding: 0 !important;
    /* font-family: 'Times New Roman', sans-serif !important; */
    /* font-size: 11pt !important; */
    /* color: #000000 !important; */
    font-family: 'Times New Roman', sans-serif !important;
    font-size: 11pt !important;
    background-color: #ffffff;
    color: #000000 !important;
    margin: 20px;
  }

  /* .page {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    background: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  } */

  .no-preview {
    display: none;
  }

  @page {
    size: A4 portrait;
    margin: 20px;
  }
}


/* @media print {
  .VApp {
    all: unset !important;
  }

  *{
    border: 1px red solid !important;
  }
  VLocaleProvider {
    all: unset !important;
  }

  body {
    font-family: "Times New Roman", serif;
    font-size: 11pt !important;
    color: #000000 !important;
    background: white !important;

  }

  body .box {
    color: #000000 !important;
    padding: 0;
    margin: 0 auto;
    height: auto !important;
    overflow: visible !important;
  }

  .page {
    width: 100%;
    margin: 0;
    padding: 0;
    box-shadow: none;
  }


  .no-print {
    display: none !important;
  }

  .title {
    font-size: 14pt !important;
    font-weight: bold;
    text-decoration: underline;
    text-align: center;
    color: #000000 !important;
    margin-top: 10px;
  }

  .box {
    font-size: 10pt !important;
    break-inside: auto !important;
    page-break-inside: auto !important;
    height: auto !important;
    overflow: visible !important;
  }

  

  .terbilang {
    font-size: 10pt !important;
  }


  .table-items {
    font-size: 10pt !important;

  }

  .table-items thead th {
    font-size: 11pt !important;
    padding: 2px;
  }

  .table-items thead th:first-child {
    width: 5% !important;
  }

  .table-items thead th:nth-child(2) {
    width: 50% !important;
  }

  .table-items thead th:nth-child(3) {
    width: 6% !important;
  }

  .table-items thead th:nth-child(4) {
    width: 19% !important;
  }

  .table-items thead th:last-child {
    width: 20% !important;
  }

  .table-items tbody td {
    padding: 2px;

  }

  .tujuan,
  .detail-invoice {
    font-size: 10pt !important;
  }

  .detail-invoice div {
    margin-bottom: -5px;
  }

  .font-normal {
    font-size: 10pt !important;
  }

  table#info-akhir td:first-child {
    padding: 4px;
    width: 55%;
    border: 1px solid #000000;
  }

  table#info-akhir td:last-child {
    padding: 4px;
    width: 45%;
    border: 1px solid #000000;
  }

  ol#note-list li {
    margin: 0px;
    padding: 0px;
  }


  @page {
    size: A4 portrait;
    margin: 1.5cm;
  }
}  */

@media print {
  /* Reset layout agar tidak terlalu kaku saat cetak */
  body {
    font-family: "Times New Roman", serif;
    font-size: 11pt;
    color: #000000 !important;
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
  }

  @page {
    size: A4 portrait;
    margin: 1.5cm;
  }

  .VApp,
  .VLocaleProvider {
    all: unset !important;
  }

  .box {
    width: 100%;
    margin: 0 auto;
    padding: 0;
    border: none;
    break-inside: auto !important;
    page-break-inside: auto !important;
    overflow: visible !important;
    height: auto !important;
  }

  .title {
    font-size: 14pt !important;
    font-weight: bold;
    text-decoration: underline;
    text-align: center;
    margin-top: 10px;
  }

  .table-items {
    width: 100%;
    border-collapse: collapse;
    font-size: 10pt;
    table-layout: fixed;
    page-break-inside: auto;
  }

  .table-items thead th {
    font-size: 11pt !important;
    padding: 2px;
  }

  .table-items tbody td {
    padding: 2px;
  }

  .tujuan,
  .detail-invoice,
  .rekening,
  #info-akhir {
    font-size: 10pt !important;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .terbilang {
    font-size: 10pt !important;
    font-style: italic;
    font-weight: bold;
  }

  #info-akhir td:first-child,
  #info-akhir td:last-child {
    padding: 4px;
    width: 50%;
    border: 1px solid #000;
    vertical-align: top;
  }

  .no-print {
    display: none !important;
  }
}


body {
  font-family: "Times New Roman", serif !important;
  font-size: 20px !important;
  color: #000000;
  background: white;

}

.header {
  width: 100%;
  text-align: center;


}

.ml-left {
  margin-left: 10px;
}

.ml-right {
  margin-right: 10px;
}

.kop-img {
  width: 100%;
  height: auto;
}

.title {
  font-size: 24px;
  font-weight: bold;
  text-decoration: underline;
  text-align: center;
  color: #000000 !important;
  margin: 0;
}

.box {
  border: 1px solid #000000;
  margin-bottom: 20px;
  width: 95%;
  margin: 0 auto;
  box-sizing: border-box;

}

.tujuan {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 10px 10px 20px 10px;
}

.tujuan #tujuan-text {
  font-weight: bold;
}

.detail-invoice {
  display: flex;
  justify-content: space-between;
  margin-bottom: -10px;
  margin: 0 10px;
}

.table-items {
  width: 100%;
  border-collapse: collapse;
  margin-top: 5px;
  table-layout: fixed;
}

.table-items thead {
  background-color: #f2f2f2;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
}



.table-items th,
.table-items td {
  border: 1px solid #000000;
  padding: 4px;
}

.table-items th.bl-0,
.table-items td.bl-0 {
  border-left: 0px;
}

.table-items th.br-0,
.table-items td.br-0 {
  border-right: 0px;
}

.table-items .m-left-detail {
  margin-left: 40px;
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}



table#info-akhir {
  width: 100%;
  border-collapse: collapse;
}

#info-akhir ol li {
  margin-bottom: 0px;
  padding: 0px;
}

table#info-akhir td {
  padding: 4px;
  width: 50%;
  border: 1px solid #000000;
}

table#info-akhir th.bl-0,
table#info-akhir td.bl-0 {
  border-left: 0px;
  border-top: 0px;
  border-bottom: 0px;
}

table#info-akhir th.br-0,
table#info-akhir td.br-0 {
  border-right: 0px;
  border-top: 0px;
  border-bottom: 0px;
}

.terbilang {
  font-weight: bold;
  font-style: italic;
}


td.m-left {
  margin-left: 10px;
}



.m-right {
  margin-right: 10px;
}


ol {
  margin-bottom: 0;
  margin-top: 10px;
  margin-left: 20px;
}

ol#note-list li {
  margin-top: -5px;
}


#info-akhir td:first-child {
  text-align: left;
  vertical-align: top;
}

#info-akhir td:first-child strong {
  display: block;
  margin-bottom: 10px;
  text-decoration: underline;

}

#info-akhir td:last-child {
  text-align: center;
  vertical-align: top;
}

table.rekening {
  border: 0px;
}

#info-akhir table.rekening td {
  border: 0px;
  padding: 2px;
  width: fit-content;
  text-align: left;
}

#info-akhir #logo {
  width: 30%;
  margin: 10px 0;
}
</style>
