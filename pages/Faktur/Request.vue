<script setup>
definePageMeta({
  layout: 'blank'
})
import { ref } from 'vue';
import {useAlertStore} from '@/stores/alert';


alert = useAlertStore()


const baseUrl = 'http://localhost:3900'; // Ganti dengan URL API yang sesuai
const url = ref('')

const tempFile = ref(null)
const file = ref(tempFile)
const previewUrl = ref(null)
const fileRules = [
  () => !!file.value || 'File wajib diisi',
  () => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.value.type) || 'ekstensi yang diperbolehkan hanyalah .jpg, .jpeg, .png',
  () => file.value.size < 2000000 || 'ukuran file maksimal 2MB',
]
//menangani file untuk diupload

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    tempFile.value = selectedFile;
  }
  console.log(event.target.files)
};

const uploadImage = async () => {  
  try {
    const { $api } = useNuxtApp()
    if (!file.value) {
      console.error('No file selected');
      return;
    }
    const formData = new FormData();
    formData.append('gambar', file.value);
    // console.log('Form data prepared for upload:', formData);
  
    // console.log(file.value)
    let response = null
    for( let i = 0; i < 1; i++) {
      response = await $api.post('/faktur', formData)
      url.value = baseUrl + '/public/images/' + response.filename
        console.log(response, 'response');
        console.log(url.value);
    }
      alert.showAlertObject({
        type: 'success',
        message: 'Gambar Berhasil di-upload',
      })
  } catch (error) {
    console.log(error)
    alert.showAlertObject({
      type: 'error',
      message: 'Gagal mengupload gambar',
    })
  }
};
watch(file, (newFile) => {
  if (newFile) {
    previewUrl.value = URL.createObjectURL(newFile)
    console.log(URL.createObjectURL(newFile))

  }
  //  // }
})
const logFile = (files) => {
  console.log('File yang dipilih:', files)
  // console.log(file.value.files)
}

const surat = ref(null)
const refForm = ref()
const seri = ref('')

const getSUrat = async () => {
  try {
    const { $api } = useNuxtApp()
    surat.value = await $api.get('/faktur/getSurat/', {no_seri:seri.value})
    console.log(surat.value)
  } catch (error) {
    console.error('Error fetching surat:', error)
  }
}
</script>

<template>
  <div>
    <VContainer>
      <Alert />
      <FakturAddFaktur />
    </VContainer>
  </div>
</template>
