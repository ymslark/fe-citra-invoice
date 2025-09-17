<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'print'
})
import jsPDF from 'jspdf'
import {useFakturStore} from '@/stores/faktur'
import { formatTanggalIndonesia, formatRupiah, npwpFormat } from '@/utils/format'

const printArea = ref(null)
const faktur = useFakturStore()
const route = useRoute()
const id = route.query.id || null
let document = null
if (id) {
  try {
    const {$api} = useNuxtApp()
    const response = await $api.get(`/Faktur/detail/${id}`)
    document = response.faktur
    console.log(document)
  } catch (error) {
    console.error("Error fetching Faktur data:", error)
    // Handle error, e.g., show an alert or redirect
  }
}
const router = useRouter()

const { $api } = useNuxtApp()
let totalHarga = 0
let htmlContent = `
            <body style="font-family: 'Times New Roman', serif; background: #fff; padding: 20px; color: #000; margin:auto; ">
            <div id="letter" style="width: 655pt; margin: 0 auto; padding: 15px 20px; border: 1px solid #333; font-size: 12pt; line-height: 1.3; box-sizing: border-box;">
                <div class="header" style="text-align: center; margin-bottom: 20px;">
                <h1 style="font-size: 15pt; margin-bottom: 5px; text-transform: uppercase;">Surat Permintaan Faktur</h1>
                <p style="font-size: 12pt;">Tanggal: ${formatTanggalIndonesia(document.tanggal)}</p>
                </div>
                <div class="data-section" style="margin-bottom: 15px;">
                <p style="margin: 4px 0; font-size: 12pt;"><strong>Nama Pembeli:</strong> ${document.pembeli.nama_pembeli}</p>
                <p style="margin: 4px 0; font-size: 12pt;"><strong>No. HP:</strong> ${document.pembeli.no_hp}</p>
                <p style="margin: 4px 0; font-size: 12pt;"><strong>NPWP:</strong> ${npwpFormat(document.pembeli.npwp)}</p>
                <p style="margin: 4px 0; font-size: 12pt;"><strong>Tanggal Pembelian:</strong> ${formatTanggalIndonesia(document.tanggal_pembelian)}</p>
                <p style="margin: 4px 0; font-size: 12pt;"><strong>Alamat:</strong> ${document.pembeli.alamat}</p>
                </div>
                <div class="npwp-image" style="margin: 15px 0; text-align: center;">
                <img src="${document.pembeli.gambar_npwp}" alt="Scan NPWP" style="width: 50%; height: auto; border: 0pt solid #333;" />
                </div>
                <table style="width: 100%; border-collapse: collapse; font-size: 12pt; margin-top: 15px; border: 1px solid #333;">
                <thead>
                    <tr>
                    <th style="border: 1px solid #333; padding: 6px 8px; text-align: center; background: #eee;">No</th>
                    <th style="border: 1px solid #333; padding: 6px 8px; text-align: center; background: #eee; width:60%;">Nama Barang</th>
                    <th style="border: 1px solid #333; padding: 6px 8px; text-align: center; background: #eee;">Harga Satuan</th>
                    <th style="border: 1px solid #333; padding: 6px 8px; text-align: center; background: #eee;">Jumlah</th>
                    <th style="border: 1px solid #333; padding: 6px 8px; text-align: center; background: #eee;">Total</th>
                    </tr>
                </thead>
                <tbody>`

console.log(document)                    
document.barang.forEach((item, index) => {
    htmlContent += `
        <tr>
            <td style="border: 1px solid #333; padding: 6px 8px; text-align: center;">${index + 1}</td>
            <td style="border: 1px solid #333; padding: 6px 8px; text-align: left;">${item.nama_barang}</td>
            <td style="border: 1px solid #333; padding: 6px 8px; text-align: left;">Rp.${formatRupiah(item.harga)}</td>
            <td style="border: 1px solid #333; padding: 6px 8px; text-align: center;">${item.qty}</td>
            <td style="border: 1px solid #333; padding: 6px 8px; text-align: right;">Rp.${formatRupiah(item.total)}</td>
        </tr>
    `
    totalHarga += item.total
})
htmlContent += `
        </tbody>
            <tfoot>
                <tr>
                <td colspan="4" style="border: 1px solid #333; font-weight: bold; text-align: right; padding: 6px 8px;">Grand Total:</td>
                <td style="border: 1px solid #333; font-weight: bold; text-align: right; padding: 6px 8px;">${formatRupiah(totalHarga)}</td>
                </tr>
            </tfoot>
            </table>
            </div>
            </body>`
// <div class="footer" style="margin-top: 30px; font-size: 12pt;">
// <p style="margin: 30px 0 0 0;">Lamongan, 27 Juni 2024</p>
// <p style="margin: 0;">Tanda Tangan,</p>
// <br><br><br>
// <p style="margin: 0;"><strong>PT. Contoh Sukses</strong></p>
// </div>
onMounted(async() => {
  // Ubah URL gambar jadi Base64
    async function toBase64(url) {
    const res = await fetch(url, { mode: 'cors' })
    const blob = await res.blob()

    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
    }

    const imgUrl = document.pembeli.gambar_npwp
    const imgBase64 = await toBase64(imgUrl)

  const doc = new jsPDF("p", "pt", "a4")
//   doc.addImage(imgBase64, 'PNG', 10, 10, 50, 20)
  doc.html(htmlContent, {
    callback: function (doc) {
      doc.save(`Permintaan Faktur Pajak ${document.pembeli.nama_pembeli}.pdf`)
      router.back() // balik ke halaman sebelumnya
    },
    margin: [20, 20, 20, 20],
    x: 10,
    y: 10,
    autoPaging: "text",
    html2canvas: { scale: 0.6 }
  })
})
</script>

<template>

</template>
