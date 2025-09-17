<script setup>
import { definePageMeta } from '#imports';
// Atur metadata default untuk semua halaman yang menggunakan layout ini
definePageMeta({
  backgroundColor: "#FFFFFF" // Default background untuk semua halaman
})
</script>

<template>
  <div>
    <slot />
  </div>
</template>


<style>

@media screen {
  
  body {
    /* font-family: 'Times New Roman', sans-serif; */
    font-size: 11pt !important;
    background-color: #ffffff;
    color: #000000;
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
  }

@media print {
  * {
    font-family: 'Times New Roman', sans-serif !important;
    color: #000000 !important;
    
  }

  body {
    font-family: 'Times New Roman', sans-serif !important;
    /* font-size: 11pt !important; */
    /* background-color: #ffffff !important; */
    margin: 0.5cm !important;
  }

  @page{
    size: 'A4';
    margin: 2cm;
  }
}
</style>
