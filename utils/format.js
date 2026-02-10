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

export function pembilang(nilai) {
  nilai = Math.floor(Math.abs(nilai));
  
  // Handle 0
  if (nilai === 0) {
    return 'Nol';
  }
  
  const huruf = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  let temp = '';
  
  const pembilangRecursive = (n) => {
    if (n < 12) {
      return huruf[n];
    } else if (n < 20) {
      return pembilangRecursive(n - 10) + ' Belas';
    } else if (n < 100) {
      return pembilangRecursive(Math.floor(n / 10)) + ' Puluh' + 
             (n % 10 !== 0 ? ' ' + pembilangRecursive(n % 10) : '');
    } else if (n < 200) {
      return 'Seratus' + (n - 100 !== 0 ? ' ' + pembilangRecursive(n - 100) : '');
    } else if (n < 1000) {
      return pembilangRecursive(Math.floor(n / 100)) + ' Ratus' + 
             (n % 100 !== 0 ? ' ' + pembilangRecursive(n % 100) : '');
    } else if (n < 2000) {
      return 'Seribu' + (n - 1000 !== 0 ? ' ' + pembilangRecursive(n - 1000) : '');
    } else if (n < 1000000) {
      return pembilangRecursive(Math.floor(n / 1000)) + ' Ribu' + 
             (n % 1000 !== 0 ? ' ' + pembilangRecursive(n % 1000) : '');
    } else if (n < 1000000000) {
      return pembilangRecursive(Math.floor(n / 1000000)) + ' Juta' + 
             (n % 1000000 !== 0 ? ' ' + pembilangRecursive(n % 1000000) : '');
    } else if (n < 1000000000000) {
      return pembilangRecursive(Math.floor(n / 1000000000)) + ' Miliar' + 
             (n % 1000000000 !== 0 ? ' ' + pembilangRecursive(n % 1000000000) : '');
    } else if (n < 1000000000000000) {
      return pembilangRecursive(Math.floor(n / 1000000000000)) + ' Triliun' + 
             (n % 1000000000000 !== 0 ? ' ' + pembilangRecursive(n % 1000000000000) : '');
    }
    return 'Nilai terlalu besar';
  };
  
  temp = pembilangRecursive(nilai);
  return temp.replace(/\s+/g, ' ').trim();
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