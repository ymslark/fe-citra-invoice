<script setup>
definePageMeta({
  layout: 'print',
  backgroundColor: '#FFFFFF'
})
import { useAlertStore } from '@/stores/alert'
import { useCiStore } from '@/stores/ciis'
import { formatRupiah, formatTanggalIndonesia } from '@/utils/format'
import { getDate } from '@/utils/global'
import { hitungInvoiceInterior } from '@/utils/invoice/hitungInvoiceInterior'
const route = useRoute()
const router = useRouter()
const cii = useCiStore()
const id = route.query.id || null
const alert = useAlertStore()

if (!id) {
  alert.showAlert({
    type: 'error',
    message: 'Tidak ada Id',
    timeout: 3000
  })
  console.error('ID tidak ditemukan')
  navigateTo({ name: 'admin-CII' })
}
let surat = null
try {
  const response = await cii.getCIIById(id)
  surat = response.doc
  console.log(surat)
  // console.log(surat.doc)
} catch (error) {
  alert.showAlert({
    type: 'error',
    message: 'Gagal mengambil data surat',
  })
}

function pembilang(nilai){
  //ubah dari nominal jadi terbilang
  nilai = Math.floor(Math.abs(nilai));
                    
  let simpanNilaiBagi = 0;
  let huruf = [ '', 'Satu','Dua','Tiga','Empat','Lima','Enam','Tujuh','Delapan','Sembilan','Sepuluh','Sebelas']
  let temp = '';
  
  if (nilai < 12) {
      temp = ' ' + huruf[nilai];
  } else if (nilai < 20) {
      temp = this.pembilang(Math.floor(nilai - 10)) + ' Belas';
  } else if (nilai < 100) {
      simpanNilaiBagi = Math.floor(nilai / 10);
      temp = this.pembilang(simpanNilaiBagi) + ' Puluh' + this.pembilang(nilai % 10);
  } else if (nilai < 200) {
      temp = ' Seratus' + this.pembilang(nilai - 100);
  } else if (nilai < 1000) {
      simpanNilaiBagi = Math.floor(nilai / 100);
      temp = this.pembilang(simpanNilaiBagi) + ' Ratus' + this.pembilang(nilai % 100);
  } else if (nilai < 2000) {
      temp = ' Seribu' + this.pembilang(nilai - 1000);
  } else if (nilai < 1000000) {
      simpanNilaiBagi = Math.floor(nilai / 1000);
      temp = this.pembilang(simpanNilaiBagi) + ' Ribu' + this.pembilang(nilai % 1000);
  } else if (nilai < 1000000000) {
      simpanNilaiBagi = Math.floor(nilai / 1000000);
      temp = this.pembilang(simpanNilaiBagi) + ' Juta' + this.pembilang(nilai % 1000000);
  } else if (nilai < 1000000000000) {
      simpanNilaiBagi = Math.floor(nilai / 1000000000);
      temp =
      this.pembilang(simpanNilaiBagi) + ' Miliar' + this.pembilang(nilai % 1000000000);
  } else if (nilai < 1000000000000000) {
      simpanNilaiBagi = Math.floor(nilai / 1000000000000);
      temp = this.pembilang(nilai / 1000000000000) + ' Triliun' + this.pembilang(nilai % 1000000000000);
  }
  
  return temp
}


onMounted(() => {
  if(process.client){
    document.title = surat.no_seri + ' Invoice ' + surat.tujuan + ' - Citra Interior'
    setTimeout(() => {
      window.print()
    }, 1000)
      window.addEventListener('afterprint', () => {
        window.location.replace('/admin/CII/detail/' + id)
        // window.location.href = '/admin/CII/detail/' + id
      //   // this.$router.push(`/admin/CII`)  // Gantilah dengan tujuan kamu
      })
  }
})
let interiors = hitungInvoiceInterior(surat.interior, surat.ppn)
console.log(interiors)
</script>

<template>
  <div class="header">
    <img class="kop-img" src="/images/citragroup/CII/CII_Kop.png" alt="" srcset="">
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
        <!-- <tr>
          <th style="width:4%;" class="">No</th>
          <th style="width:51%;">Keterangan</th>
          <th style="width:5%;">Ukuran</th>
          <th style="width:20%;">Harga permeter</th>
          <th style="width:20%;" class="">Total Harga</th>
        </tr> -->
        <tr>
          <th class="bl-0">No</th>
          <th>Keterangan</th>
          <th>Harga perMeter</th>
          <th>Volume</th>
          <th>Subtotal</th>
          <th>Diskon</th>
          <th class="br-0">Harga Akhir</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in interiors.interiors" :key="index">
          <td class="text-center bl-0">{{ index + 1 }}</td>
          <td class="text-uppercase">{{ item.nama_interior }}</td>
          <td class="angka-kanan br-0">
            <span class="rp">Rp.</span>
            <span class="nilai">{{ formatRupiah(item.dpp_tanpa_diskon) }}</span>
          </td>
          <td class="text-center">{{ ` ${item.v1} x ${item.v2}m` }}</td>
          <!-- <td class="text-right">{{ formatRupiah(item.harga) }}</td> -->
          <!-- <td class="text-right br-0">{{ formatRupiah(item.total_harga) }}</td> -->
          <td class="angka-kanan br-0">
            <span class="rp">Rp.</span>
            <span class="nilai">{{ formatRupiah(item.total_dpp_tanpa_diskon) }}</span>
          </td>
          <td class="angka-kanan br-0">
            <span class="rp">Rp.</span>
            <span class="nilai">{{ formatRupiah(item.total_diskon) }}</span>
          </td>
          <td class="angka-kanan br-0">
            <span class="rp">Rp.</span>
            <span class="nilai">{{ formatRupiah(item.total_dpp) }}</span>
          </td>
        </tr>
        <tr style="font-weight: bold;">
          <td colspan="3" class="br-0 bl-0"></td>
          <td class="bl-0">Total</td>
          <td class="angka-kanan br-0">
            <span class="rp">Rp</span>
            <span class="nilai">{{formatRupiah( interiors.dpp_tanpa_diskon )}}</span>
          </td>
          <td class="angka-kanan br-0">
            <span class="rp">Rp</span>
            <span class="nilai">{{formatRupiah( surat.total_diskon )}}</span>
          </td>
          <td class="angka-kanan br-0">
            <span class="rp">Rp</span>
            <span class="nilai">{{formatRupiah( interiors.dpp )}}</span>
          </td>
        </tr>
        <!-- <tr>
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
        </tr> -->
        <!-- <tr>
          <td colspan="3" class="br-0 bl-0"></td>
          <td class="bl-0 m-left-detail">Total</td>
          <td class="angka-kanan br-0">
            <span class="rp">Rp.</span>
            <span class="nilai">{{ formatRupiah(surat.total_harga_awal) }}</span>
          </td>
        </tr> -->
        <tr v-if="surat.ppn > 0">
          <td colspan="5" class="br-0 bl-0"></td>
          <td class="bl-0 detail-total"><b><span style="margin-left:10px;">{{`PPN ${surat.ppn}%`}}</span></b></td>
          <td class="angka-kanan br-0">
            <span class="rp">Rp</span>
            <span class="nilai">{{formatRupiah( interiors.ppn  )}}</span>
            </td>
        </tr>
        <tr>
          <td colspan="5" class="br-0 bl-0"></td>
          <td class="bl-0 detail-total"><b><span style="margin-left:10px;">Total Bayar</span></b></td>
          <td class="angka-kanan br-0">
            <span class="rp">Rp.</span>
            <span class="nilai">{{ formatRupiah(surat.harga_akhir) }}</span>
          </td>
        </tr>
        <tr>
          <td class="bl-0 terbilang br-0 m font-normal" colspan="7">Terbilang: {{ pembilang(surat.harga_akhir) }} Rupiah</td>
        </tr>
        <tr>
          <td class="bl-0 br-0 m-left font-normal" colspan="7">
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
          <div>Bekasi, {{ formatTanggalIndonesia(surat.tanggal, 'hari') }}</div>
          <img src="/images/citragroup/CII/CII_Logo.png" id="logo">
          <div>Citra Interior Indonesia</div>
        </td>
      </tr>
    </table>

  </div>
  <!-- box -->



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


@media print {
  .VApp {
    all: unset !important;
  }

  *{
    color: #000000 !important;
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
    font-size: 9pt !important;

  }
/* 5%, 35%, 12%, 8%, 12%, 8%, 20% */
  .table-items thead th:first-child {
    width: 3% !important;
  }

  .table-items thead th:nth-child(2) {
    max-width: 24% !important;
  }

  .table-items thead th:nth-child(3) {
    max-width: 15% !important;
  }

  .table-items thead th:nth-child(4) {
    max-width: 9% !important;
  }
  .table-items thead th:nth-child(5) {
    max-width: 16% !important;
  }
  .table-items thead th:nth-child(6) {
    max-width: 16% !important;
  }

  .table-items thead th:last-child {
    max-width: 16% !important;
  }

  .table-items tbody td {
    padding: 1px;

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
  min-width: 7ch; /* biarkan panjang angka fleksibel */
  text-align: right;
  margin-right: 2pt; /* jarak antara angka dan Rp */
}

</style>
