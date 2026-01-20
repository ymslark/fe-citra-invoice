// utils/priceFormatter.js

/**
 * Format number to Indonesian currency format
 * @param {string} value - The input value from the user
 * @returns {string} - Formatted currency string
 */
export function formatToIndonesianCurrency(value) {
  // Remove any non-digit, non-comma, and non-dot characters
  console.log(value)

  const cleanedValue = value.replace(/[^\d,.]/g, '')

  // Replace commas with dots for decimal separation
  const normalizedValue = cleanedValue.replace(',', '.')

  // Convert to a number
  const numberValue = parseFloat(normalizedValue)

  if (isNaN(numberValue)) {
    return ''
  }

  // Format number to Indonesian currency format
  return numberValue.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * 
 * @param {string} value
 * @returns {string} 
 */


export function formatRupiah(value,  rp = ''){
  let style = rp == 'rp' ? 'currency' : 'decimal'
  return new Intl.NumberFormat('id-ID', {
    style,
    currency: 'IDR',
    minimumFractionDigits: 2, // Menghilangkan angka desimal jika tidak diperlukan
  }).format(value)
}

export function formatAngkaIndo(value,  rp = ''){
  let style = rp == 'rp' ? 'currency' : 'decimal'
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
   // Menghilangkan angka desimal jika tidak diperlukan
  }).format(value)
}

/**
 * Convert formatted currency string to a number for backend processing
 * @param {string} formattedValue - The formatted currency string
 * @returns {number} - The number without formatting
 */
export function parseCurrencyToNumber(formattedValue) {
  // Remove thousand separators and replace comma with dot
  const normalizedValue = formattedValue.replace(/\./g, '').replace(',', '.')

  // Convert to a number
  return parseFloat(normalizedValue)
}

export function formatTanggalIndonesia(tanggalString, opsi = null) {
  //hari
  let hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const tanggal = new Date(tanggalString)
  // Format tanggal ke string dengan hari
  
  // Parse string tanggal ke objek Date
  const [year, month, day] = tanggalString.split('-')
  const date = new Date(year, month - 1, day) // Bulan dimulai dari 0

  // Buat formatter untuk lokal Indonesia
  const formatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return opsi == 'hari' ? `${hari[tanggal.getDay()]}, ${formatter.format(date)}` : `${formatter.format(date)}`
  // return formatter.format(date)
}

export function pembilang(nilai){
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


export function npwpFormat(npwp) {
  // Format NPWP menjadi 99.999.999.9-999.999
  const cleaned = ('' + npwp).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}.${match[4]}-${match[5]}.${match[6]}`;
  }
  return npwp; // Kembalikan nilai asli jika format tidak sesuai
}

/**
 * Generate nama file PDF sesuai format:
 * [TIPE_DOKUMEN]_[PT_PEMBUAT]_TO_[PT_TUJUAN]_[YYYYMMDD].pdf
 * 
 * @param {string} type - Tipe dokumen (INVOICE, SPF, PENAWARAN, SJ)
 * @param {string} ptPembuat - Nama PT pembuat dokumen
 * @param {string} ptTujuan - Nama PT tujuan dokumen
 * @param {Date} date - Tanggal dokumen (default: today)
 * @returns {string} Nama file PDF
 */
export function generateFileName(type, ptPembuat, ptTujuan, date) {
  const formatName = (name) =>
    name.toUpperCase().replace(/\s+/g, '-')

  const formattedDate = date.replace(/-/g, '')

  return `${type.toUpperCase()}_${formatName(ptPembuat)}_TO_${formatName(ptTujuan)}_${formattedDate}.pdf`
}

export function parseIndoFloat(str) {
  if (!str) return 0

  return parseFloat(
    str
      .toString()
      .replace(/\./g, '')   // hapus pemisah ribuan
      .replace(',', '.')   // ganti koma ke titik
  )
}