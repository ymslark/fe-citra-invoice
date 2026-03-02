<template>
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
    margin: 2cm;
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
    margin: 2cm;
  }
}
</style>