<script setup>
definePageMeta({
  layout: 'print',
  backgroundColor: '#FFFFFF'
})
import { useAlertStore } from '@/stores/alert'
import { useMemoStore } from '@/stores/memo'
import { formatRupiah, formatTanggalIndonesia, pembilang } from '@/utils/format'
import { getDate } from '@/utils/global'
const route = useRoute()
const router = useRouter()
const memo = useMemoStore()
const id = route.query.id || null
const alert = useAlertStore()
const config = useRuntimeConfig()
const baseUrl = config.public.apiUrl // Ganti dengan URL API yang sesuai
if (!id) {
  alert.showAlert({
    type: 'error',
    message: 'Tidak ada Id',
    timeout: 3000
  })
  console.error('ID tidak ditemukan')
  navigateTo({ name: 'admin-Memo' })
}
let surat = null
try {
  const response = await memo.getMemoById(id)
  surat = response.doc
  console.log(surat)
  // console.log(surat.doc)
} catch (error) {
  alert.showAlert({
    type: 'error',
    message: 'Gagal mengambil data surat',
  })
}
console.log(surat)
let kopUrl = `/images/citragroup/${surat.perusahaan}/${surat.perusahaan}_Kop.`
surat.perusahaan == 'CF' ? kopUrl += 'jpeg' : kopUrl += 'jpg'
const logoUrl = `/images/citragroup/${surat.perusahaan}/${surat.perusahaan}_Logo.png`
console.log(kopUrl, logoUrl)
onMounted(() => {
  if(process.client){
    document.title = 'Surat Jalan ' + surat.tujuan + ' - Citra Furniture'
    setTimeout(() => {
      window.print()
    }, 1000)

    window.addEventListener('afterprint', () => {
        window.location.replace('/admin/Memo/detail/' + id)
    })
  }
})
</script>

<template>
  <div class="header">
    <img class="kop-img" :src="kopUrl" alt="" srcset="">
  </div>

  <!-- box -->
  <div class="box">

    <div class="meta">
      <div>Hal : Surat Jalan {{surat.jenis_memo}}</div>
      <div>Bekasi, {{ formatTanggalIndonesia(getDate(), 'hari') }}</div>
    </div>
    <div class="meta">
      <div style="width: 50%;">
        Kepada YTh. <b>{{ surat.tujuan }}</b> <br>
        No. Hp: {{ surat.no_hp }}<br>  
        {{surat.alamat}} 
      </div>
    </div>
    <div class="meta">
      <div> Bersama dengan surat jalan ini, kami ingin memberitahukan perihal pengiriman barang pada hari {{ formatTanggalIndonesia(surat.tanggal, 'hari') }}</div>
    </div>
    <table class="table-items">
      <thead>
        <tr>
          <th style="width:5%;">No</th>
          <th style="width:57%;">Nama Barang</th>
          <!-- <th style="width:20%">Keterangan</th> -->
          <th style="width:8%;">Qty</th>
          <th style="width:30%;">Keterangan</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in surat.barang" :key="index">
          <td class="text-center">{{ index + 1 }}</td>
          <td class="text-uppercase">{{ item.nama_barang }}</td>
          <td class="text-center">{{ item.qty }}</td>
          <td class="text-uppercase">{{ item.keterangan }}</td>
        </tr>
      </tbody>
    </table>
    <div class="notes">
      <p>Barang-barang tersebut akan kami
      <span v-if="surat.jenis_memo == 'Pengambilan Barang'">ambil</span>
      <span v-if="surat.jenis_memo == 'Pengiriman Barang'">kirim</span>
       dengan data kendaraan sebagai berikut :</p>
      <table id="info-akhir">
        <tr>
          <td>Nama Supir</td>
          <td>:</td>
          <td class="bold">{{ surat.supir.nama_supir }}</td>
        </tr>
        <tr>
          <td>No. Hp Driver</td>
          <td>:</td>
          <td class="bold">{{ surat.supir.no_hp }}</td>
        </tr>
        <tr>
          <td>Nomor Kendaraan</td>
          <td>:</td>
          <td class="bold">{{ surat.supir.no_kendaraan }}</td>
        </tr>
      </table>
    </div>
    <div class="footer-surat">
      <div class="tanggal">Bekasi, {{ formatTanggalIndonesia(getDate()) }}</div>
      <div style="margin-top: -15px; margin-bottom: 5px;">Hormat Kami</div>
      <img :src="logoUrl" alt="Logo Perusahaan" />
      <div class="nama-perusahaan">Citra Furniture Indonesia</div>
    </div>
  </div>

  <!-- box -->

</template>
<style scoped>
@media screen {
  * {
    font-family: 'Times New Roman', sans-serif !important;
    color: #000 !important;
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
    font-size: 11pt !important;
  }

  .footer-surat img{
    max-width: 50%;
    height: auto;
  }
  body{
    margin: 0;
    padding: 0;
  }
  .table-items th, .table-items td {
    font-size: 9pt !important;
  }
  @page {
    size: A4;
    margin: 2cm;
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
  width: 100%;
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
  width: 95%;
  border-collapse: collapse;
  margin: auto;

}

.table-items th {
  background-color: rgb(0, 210, 0);
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
}

.table-items th,
.table-items td {
  border: 1px solid #000;
  padding: 4px;
  /* text-align: left; */
}
#info-akhir {
  /* width: 50%; */
  /* margin: auto; */
  border-collapse: collapse;
  margin-top: 20px;
}

#info-akhir td {
  padding: 2px;
  /* width: 50%; */
  /* vertical-align: top; */
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
  margin-right: 10px; /* jarak antara angka dan Rp */
}


/* .notes {
  margin: 10px 0 0px 20px;
} */

 
.notes ol {
  padding-left: 20px;
  margin-top: 0;
}

.rekening{
  margin-left: 20px;;
}
</style>
