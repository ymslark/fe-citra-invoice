<!-- <!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Surat Permintaan Faktur - Final</title>
<style>
  body {
    font-family: 'Times New Roman', serif;
    background: #fff;
    padding: 20px;
    color: #000;
  }
  .letter-container {
    max-width: 700px;
    margin: 0 auto;
    padding: 15px 20px;
    border: 1px solid #333;
    font-size: 12px;
    line-height: 1.3;
  }
  .header {
    text-align: center;
    margin-bottom: 20px;
  }
  .header h1 {
    font-size: 18px;
    margin-bottom: 5px;
    text-transform: uppercase;
  }
  .header p {
    font-size: 11px;
  }
  .data-section p {
    margin: 4px 0;
    font-size: 11px;
  }
  .npwp-image {
    margin: 15px 0;
    text-align: center;
  }
  .npwp-image img {
    max-width: 180px;
    height: auto;
    border: 1px solid #333;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
    margin-top: 15px;
  }
  table, th, td {
    border: 1px solid #333;
  }
  th, td {
    padding: 6px 8px;
    text-align: left;
  }
  th {
    background: #eee;
  }
  tfoot td {
    font-weight: bold;
    text-align: right;
  }
  .footer {
    margin-top: 30px;
    font-size: 11px;
  }
  .footer p {
    margin: 30px 0 0 0;
  }
</style>
</head>
<body>
  <div class="letter-container" id="letter">
    <div class="header">
      <h1>Surat Permintaan Faktur</h1>
      <p>Nomor: 001/SPF/2024 &nbsp;&nbsp;&nbsp; Tanggal: 27 Juni 2024</p>
    </div>

    <div class="data-section">
      <p><strong>Nama Pembeli:</strong> PT. Contoh Sukses</p>
      <p><strong>No. HP:</strong> 081234567890</p>
      <p><strong>NPWP:</strong> 12.345.678.9-012.000</p>
      <p><strong>Alamat:</strong> Jl. Merdeka No. 123, Jakarta</p>
    </div>

    <div class="npwp-image">
      <img src="https://placehold.co/180x120?text=NPWP+Scan" alt="Scan NPWP" />
    </div>

    <table>
      <thead>
        <tr>
          <th>No</th>
          <th>Nama Barang</th>
          <th>Jumlah</th>
          <th>Satuan</th>
          <th>Harga Satuan (Rp)</th>
          <th>Total (Rp)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Komputer</td>
          <td>10</td>
          <td>Pcs</td>
          <td>5.000.000</td>
          <td>50.000.000</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Printer</td>
          <td>5</td>
          <td>Pcs</td>
          <td>1.500.000</td>
          <td>7.500.000</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Meja Kantor</td>
          <td>7</td>
          <td>Unit</td>
          <td>750.000</td>
          <td>5.250.000</td>
        </tr>
        Tambah baris barang sesuai kebutuhan
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5">Grand Total:</td>
          <td>62.750.000</td>
        </tr>
      </tfoot>
    </table>

    <div class="footer">
      <p>Lamongan, 27 Juni 2024</p>
      <p>Tanda Tangan,</p>
      <br><br><br>
      <p><strong>PT. Contoh Sukses</strong></p>
    </div>
  </div>
</body>
</html> -->


<template>
  <div class="letter-container" id="letter">
    <div class="header">
      <h1>Surat Permintaan Faktur</h1>
      <p>Nomor: 001/SPF/2024 &nbsp;&nbsp;&nbsp; Tanggal: 27 Juni 2024</p>
    </div>

    <div class="data-section">
      <p><strong>Nama Pembeli:</strong> PT. Contoh Sukses</p>
      <p><strong>No. HP:</strong> 081234567890</p>
      <p><strong>NPWP:</strong> 12.345.678.9-012.000</p>
      <p><strong>Alamat:</strong> Jl. Merdeka No. 123, Jakarta</p>
    </div>

    <div class="npwp-image">
      <img src="https://placehold.co/180x120?text=NPWP+Scan" alt="Scan NPWP" />
    </div>

    <table>
      <thead>
        <tr>
          <th>No</th>
          <th>Nama Barang</th>
          <th>Jumlah</th>
          <th>Satuan</th>
          <th>Harga Satuan (Rp)</th>
          <th>Total (Rp)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Komputer</td>
          <td>10</td>
          <td>Pcs</td>
          <td>5.000.000</td>
          <td>50.000.000</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Printer</td>
          <td>5</td>
          <td>Pcs</td>
          <td>1.500.000</td>
          <td>7.500.000</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Meja Kantor</td>
          <td>7</td>
          <td>Unit</td>
          <td>750.000</td>
          <td>5.250.000</td>
        </tr>
        Tambah baris barang sesuai kebutuhan
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5">Grand Total:</td>
          <td>62.750.000</td>
        </tr>
      </tfoot>
    </table>

    <div class="footer">
      <p>Lamongan, 27 Juni 2024</p>
      <p>Tanda Tangan,</p>
      <br><br><br>
      <p><strong>PT. Contoh Sukses</strong></p>
    </div>
  </div>
</template>
<script setup>

const props = defineProps({
  faktur: {
    type: Object,
    required: true
  }
})

</script>
<style scoped>
 body {
    font-family: 'Times New Roman', serif;
    background: #fff;
    padding: 20px;
    color: #000;
  }
  .letter-container {
    max-width: 700px;
    margin: 0 auto;
    padding: 15px 20px;
    border: 1px solid #333;
    font-size: 12px;
    line-height: 1.3;
  }
  .header {
    text-align: center;
    margin-bottom: 20px;
  }
  .header h1 {
    font-size: 18px;
    margin-bottom: 5px;
    text-transform: uppercase;
  }
  .header p {
    font-size: 11px;
  }
  .data-section p {
    margin: 4px 0;
    font-size: 11px;
  }
  .npwp-image {
    margin: 15px 0;
    text-align: center;
  }
  .npwp-image img {
    max-width: 180px;
    height: auto;
    border: 1px solid #333;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
    margin-top: 15px;
  }
  table, th, td {
    border: 1px solid #333;
  }
  th, td {
    padding: 6px 8px;
    text-align: left;
  }
  th {
    background: #eee;
  }
  tfoot td {
    font-weight: bold;
    text-align: right;
  }
  .footer {
    margin-top: 30px;
    font-size: 11px;
  }
  .footer p {
    margin: 30px 0 0 0;
  }
</style>
