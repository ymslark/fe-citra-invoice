// plugins/currency.js
export default defineNuxtPlugin((nuxtApp) => {
  function formatRupiah(number, raw = true) {
    //raw artinya hanya kasih titik tanpa Rp
    console.log(number)
    let angka = number.replace(/\D/g, '') // Hanya ambil angka
    let nominal = parseInt(number || '0').toLocaleString('id-ID') // Format pakai titik
    
    if(raw) return nominal
    
    // Jika tidak raw, tambahkan Rp di depan
    return `Rp ${nominal}`
  }

  function parseRupiah(nominal) {
    if (typeof nominal !== 'string') return 0

    // Hapus semua karakter yang bukan angka, misalnya 'Rp', spasi, titik, koma, dll
    const angka = nominal.replace(/[^0-9]/g, '')

    // Ubah string angka hasilnya jadi integer
    return parseInt(angka) || 0
  }

  // Inject ke context Nuxt dan Vue app, bisa dipanggil via useNuxtApp() atau di template dengan $formatRupiah()
  nuxtApp.provide('formatRupiah', formatRupiah)
  nuxtApp.provide('parseRupiah', parseRupiah)
});
