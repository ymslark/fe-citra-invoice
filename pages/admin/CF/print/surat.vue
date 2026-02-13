<script setup>
definePageMeta({
  layout: 'print',
  backgroundColor: '#FFFFFF'
})
import { useAlertStore } from '@/stores/alert'
import { useCFStore } from '@/stores/cf'
import { formatRupiah, formatTanggalIndonesia, pembilang } from '@/utils/format'
import {  hitungInvoiceBarang } from '@/utils/invoice/hitungInvoiceBarang'
import { getDate } from '@/utils/global'
import jsPDF from 'jspdf'
const route = useRoute()
const router = useRouter()
const cf = useCFStore()
const id = route.query.id || null
const alert = useAlertStore()
const printArea = ref(null)
if (!id) {
  alert.showAlert({
    type: 'error',
    message: 'Tidak ada Id',
    timeout: 3000
  })
  console.error('ID tidak ditemukan')
  navigateTo({ name: 'admin-CF' })
}
let surat = null
let barang = null
try {
  await cf.getCFById(id)
  surat = cf.surat
  // // console.log(surat.doc)
  barang = hitungInvoiceBarang(surat.barang, surat.ppn) 
  // console.log(barang)
} catch (error) {
  alert.showAlert({
    type: 'error',
    message: 'Gagal mengambil data surat',
  })
}

// onMounted(() => {
//   if(process.client){
//     document.title = surat.no_seri + ' Surat Penawaran ' + surat.tujuan + ' - Citra Furniture'
//     setTimeout(() => {
//       window.print()
//     }, 1000)

//     window.addEventListener('afterprint', () => {
//         window.location.replace('/admin/CF/detail/' + id)
//     })
//   }
// })
onMounted(async () => {

  await nextTick()

  setTimeout(() => {
    window.print()
  }, 1000)
    window.addEventListener('afterprint', () => {
      window.location.replace('/admin/CF/detail/' + id)
    })
})

</script>

<template>
    <div class="header">
      <img 
        class="kop-img" 
        src="/images/citragroup/CF/CF_Kop.jpeg" 
        alt="" 
        srcset="">
    </div>
  
    <!-- box -->
    <div class="box">
  
      <div class="meta">
        <div class="d-flex flex-column">
          <span>Hal : {{surat.hal}}</span>
          <span>Kepada YTh. <b>{{ surat.tujuan }}</b></span>
          <span>{{ surat.no_hp }}</span>
          <span>{{ surat.alamat }}</span>
  
        </div>
        <div class="d-flex flex-column">
          <span>{{formatTanggalIndonesia(getDate(), 'hari')}}</span>
          <span>No.Seri : {{surat.no_seri}}</span>
        </div>
      </div>
      <p style="text-indent:2em; line-height:1.4; margin-bottom: 1em;">Dengan hormat, bersama surat ini kami sampaikan penawaran harga terkait produk yang kami tawarkan sesuai dengan kebutuhan Bapak/Ibu. Adapun rincian penawaran kami sajikan pada tabel berikut untuk dapat dipelajari dan dipertimbangkan.
        </p>
      <table class="table-items">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Barang</th>
            <th>Harga Satuan</th>
            <th>Qty</th>
            <th>subtotal</th>
            <th>Diskon</th>
            <th>Total</th>
          </tr> 
        </thead>
        <tbody>
          <tr v-for="(item, index) in barang.barangs" :key="index">
            <td class="text-center">{{ index + 1 }}</td>
            <td v-if="index % 2 == 1" class="text-uppercase text-wrap" style="padding-left: 1ch !important;">{{ item.nama_barang }}</td>
            <td v-else class="text-uppercase text-wrap" style="padding-left: 1ch !important;">{{ item.nama_barang }}</td>
  
            <td class="angka-kanan">
              <span class="rp">Rp.</span>
              <span class="nilai">{{ formatRupiah(item.dpp_tanpa_diskon) }}</span>
            </td>
            <td class="text-center" id="qty" style="padding: 1pt;">{{ item.qty }}</td>
            <td class="angka-kanan">
              <span class="rp">Rp.</span>
              <span class="nilai">{{ formatRupiah(item.total_dpp_tanpa_diskon) }}</span>
            </td>
            <td class="angka-kanan">
              <span class="rp">Rp.</span>
              <span class="nilai">{{ formatRupiah(item.total_diskon) }}</span>
            </td>
            <td class="angka-kanan">
              <span class="rp">Rp</span>
              <span class="nilai">{{ formatRupiah(item.total_dpp) }}</span>
              </td>
          </tr>
  
          <tr style="font-weight: bold;">
            <td colspan="3" class="br-0"></td>
            <td class="bl-0">Total</td>
            <td class="angka-kanan">
              <span class="rp">Rp</span>
              <span class="nilai">{{formatRupiah( barang.dpp_tanpa_diskon )}}</span>
            </td>
            <td class="angka-kanan">
              <span class="rp">Rp</span>
              <span class="nilai">{{formatRupiah( surat.total_diskon )}}</span>
            </td>
            <td class="angka-kanan">
              <span class="rp">Rp</span>
              <span class="nilai">{{formatRupiah( barang.dpp )}}</span>
            </td>
          </tr>
          <!-- <tr v-if="surat.total_diskon > 0" >
            <td colspan="3" class="br-0"></td>
            <td class="bl-0">DISKON</td>
            <td class="angka-kanan">
              <span class="rp">Rp</span>
              <span class="nilai">{{ formatRupiah(surat.total_diskon) }}</span>
            </td>
            <td class="text-right"></td>
          </tr> -->
          <!-- <tr>
            <td colspan="5" class="br-0"></td>
            <td class="bl-0">Total Harga Akhir</td>
            <td class="angka-kanan">
              <span class="rp">Rp</span>
              <span class="nilai">{{formatRupiah( barang.dpp )}}</span>
              </td>
          </tr> -->
          <!-- <tr>
            <td colspan="5" class="br-0"></td>
            <td class="bl-0">Subtotal</td>
            <td class="angka-kanan">
              <span class="rp">Rp</span>
              <span class="nilai">{{formatRupiah( surat.harga_akhir * ((100-surat.ppn)/100) )}}</span>
              </td>
          </tr> -->
          <tr v-if="surat.ppn > 0">
            <td colspan="5" class="br-0"></td>
            <td class="bl-0">PPN 11%</td>
            <td class="angka-kanan">
              <span class="rp">Rp</span>
              <span class="nilai">{{formatRupiah( barang.ppn )}}</span>
              </td>
          </tr>
          <tr style="font-weight: bold;">
            <td colspan="5" class="br-0"></td>
            <td class="bl-0">Total</td>
            <td class="angka-kanan">
              <span class="rp">Rp.</span>
              <span class="nilai">{{ formatRupiah(surat.harga_akhir) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="notes">
        <span>Note:</span>
        <ol id="note-list">
          <li v-if="surat.ppn > 0" >Harga Termasuk PPN {{surat.ppn}}%</li>
          <li v-else>Harga Tidak Termasuk PPN</li>
          <li v-if="surat.ongkos_kirim && surat.instalasi">Harga Sudah Termasuk Ongkos Kirim & Sudah Termasuk Biaya
            Instalasi</li>
          <li v-else-if="surat.instalasi">Harga Sudah Termasuk Biaya Instalasi</li>
          <li v-else-if="surat.ongkos_kirim">Harga Sudah Termasuk Biaya Ongkos Kirim</li>
          <!-- <li v-if="surat.catatan[0].length > 3">{{surat.catatan[0]}}</li> -->
          <li>Pembayaran Via Transfer ke rekening :</li>
        </ol>
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
      </div>
      <div class="footer-surat">
        <div class="tanggal">Bekasi, {{ formatTanggalIndonesia(getDate()) }}</div>
        <div class="mt-n3">Hormat Kami</div>
        <img src="/images/citragroup/CF/CF_Logo.png" alt="Logo Perusahaan" />
        <div class="nama-perusahaan">Citra Furniture Indonesia</div>
      </div>
    </div>
  
    <!-- box -->

</template>
<style scoped>
@media screen {
  * {
    font-family: 'Times New Roman', sans-serif !important;
    color: #000000 !important;
    margin: 0px;
    padding: 0px;
    /* border: 1px red solid; */
    
  }

  @page {
    size: A4;
    margin: 2cm;
  }
}

@media print {
  * {
    font-family: 'Times New Roman', sans-serif !important;
    color: #000 !important;
    margin: 0px;
    padding: 0px;
    font-size: 11pt;
  }

  .footer-surat img{
    max-width: 50%;
    height: auto;
  }

  .table-items tbody{
    page-break-inside: avoid !important;
    font-size: 9pt !important;
  }

  .table-items tbody td{
    font-family: 'Times New Roman', sans-serif !important;
    font-size: 9pt !important;
  }
/* 5%, 35%, 12%, 8%, 12%, 8%, 20% */
  .table-items thead th:first-child {
    width: 3% !important;
  }

  .table-items thead th:nth-child(2) {
    width: 27% !important;
    text-wrap: wrap;
    
  }

  .table-items thead th:nth-child(3) {
    /* width: 15% !important; */
    text-wrap: nowrap;
  }

  .table-items thead th:nth-child(4) {
    /* width: 5% !important; */
    text-wrap: nowrap; 
  }
  .table-items thead th:nth-child(5) {
    /* width: 16% !important; */
    text-wrap: nowrap;
  }
  .table-items thead th:nth-child(6) {
    /* width: 16% !important; */
    text-wrap: nowrap;
  }

  .table-items thead th:last-child {
    /* width: 18% !important; */
    text-wrap: nowrap;
  }
  .table-items th, .table-items td {
    border: 1px solid #000000 !important;
  }

  .table-items tbody td {
    padding: 0px;
    font-size: 9pt !important;
  }

  #qty{
    padding: 0px !important;
    font-size: 10pt !important;
  }
  .table-items .bl-0 {
    border-left: 0 !important;
  }
  .table-items .br-0{
    border-right: 0 !important;
  }

  
  /* .table-items {
    font-size: 9pt !important;

  } */
  /* .table-items td.detail-total {
    margin-left: 20px;
    font-weight: bold;
  } */
  .table-items thead th {
    font-size: 9pt !important;
    padding: 1px;
  }

  body{
    size: A4;
  }
  @page {
    size: A4;
    margin: 0.5cm;
  }
}


.box {
  width: 95%;
  padding: 20px;
  margin:auto;
  box-sizing: border-box;
  font-size: 24px;
  
}
.box::after {
  content: "";
  display: table;
  clear: both;
}

.header {
  text-align: center;
  /* margin-bottom: 20px; */
}
.kop-img {
  width: 94%;
  height: auto;
}
.meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.bold {
  font-weight: bold;
}

.table-items {
  /* width: 90%; */
  border-collapse: collapse;
  margin: auto;
  font-size: 24px !important;
}


.table-items th {
  background-color: rgb(0, 210, 0);
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
}

.table-items th:nth-child(2){
  text-wrap: wrap;
}

.table-items th,
.table-items td {
  border: 1px solid #000;
  padding: 2px 4px;
  
  /* text-align: left; */
}
#info-akhir {
  width: 100%;
  margin: auto;
  border-collapse: collapse;
  margin-top: 20px;
}
#info-akhir td {
  padding: 8px;
  width: 50%;
  vertical-align: top;
  /* border: 1px solid #000; */
}

#logo {
  width: 25%;
  height: auto;
  margin-top: 10px;
  margin-bottom: 20px;
}
.notes{
  margin-top: 20px;
}
div .footer {
  float:right;
  align-items: center;
}
.footer {
  display: flex;
  flex-direction: column;
  /* font-weight: bold; */
}

.footer-surat {
  width: 40%; /* atur sesuai kebutuhan */
  float: right;
  text-align: center;
  margin-right: -20px;
}

.footer-surat img {
  max-width: 50%;
  display: block;
  margin: 0 auto;
}

.footer-surat .tanggal {
  margin-bottom: 10px;
}

.footer-surat .nama-perusahaan {
  font-weight: bold;
  margin-top: 5px;
}

.bl-0 {
  border-left: 0 !important;
}

.br-0{
  border-right: 0 !important;
}

.angka-kanan {
  text-align: right;
}

.angka-kanan .rp {
  display: inline-block;
  width: 3ch;  /* cukup untuk 'Rp ' */
  text-align: left;
}

.angka-kanan .nilai {
  display: inline-block;
  min-width: 8ch; /* biarkan panjang angka fleksibel */
  text-align: right;
  margin-right: 5px; /* jarak antara angka dan Rp */
}


/* .notes {
  margin: 10px 0 0px 20px;
} */ 

 
.notes ol {
  padding-left: 20px;
  margin-top: 0;
}

.rekening{
  margin-left: 20px;
}

.bl-0 {
  border-left: 0 !important;
}
.br-0{
  border-right: 0 !important;
}
</style>
