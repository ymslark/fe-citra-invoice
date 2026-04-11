<!-- <template>
  <slot />
</template>

<style>
@media print {
  html {
    font-size: 11pt;
  }

  body {
    font-family: 'Times New Roman', serif;
    font-size: 11pt;
    color: #000;
    margin: 0.5cm;
  }

  p {
    text-align: justify;
    line-height: 1.4;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10pt;
  }

  th, td {
    border: 1px solid #000;
    padding: 4pt;
  }

  .angka-kanan {
    text-align: right;
  }

  .text-center {
    text-align: center;
  }

  @page {
    size: A4;
    margin: 0.5cm;
  }
}
</style> -->

<!-- layouts/print-layout.vue -->
<template>
  <div class="print-layout">
    <slot />
  </div>
</template>

<style scoped>
/* Reset total di layout ini */
.print-layout,
.print-layout * {
  all: initial; /* Hati-hati, tapi ini efektif */
  display: revert; /* Biar balik ke display normal */
}

/* Atau manual lebih aman: */
.print-layout {
  all: unset;
  display: block;
}
</style>

<!-- JANGAN pake global CSS di sini -->