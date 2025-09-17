<script setup>
import pages404 from '@images/pages/404.png'

import miscMaskDark from '@images/pages/misc-mask-dark.png'
import miscMaskLight from '@images/pages/misc-mask-light.png'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'

definePageMeta({
  alias: '/pages/misc/not-found',
  layout: 'blank',

})

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader
    status-code="404"
    title="Not Found! 🔐"
    description="Halaman yang anda cari tidak ditemukan!!!!"
    />
    <!-- <ErrorHeader
    status-code="1312"
    title="Alamak! 🔐"
    description="Halaman yang anda cari tidak ditemukan!!!!"
    /> -->

  <!-- <VBtn
    class="mb-11 mx-auto"
    to="/"
  >
    Back To Home
  </VBtn> -->
    
    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg
        :src="pages404"
        alt="Nout Found"
        :max-height="$vuetify.display.smAndDown ? 350 : 500"
        class="mx-auto"
      />
    </div>

    <img
      class="misc-footer-img d-none d-md-block"
      :src="authThemeMask"
      alt="misc-footer-img"
      height="320"
    >
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>
