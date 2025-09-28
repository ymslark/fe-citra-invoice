<!-- <script setup>
import { useTheme } from 'vuetify'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import {
  initConfigStore,
  useConfigStore,
} from '@core/stores/config'
import { hexToRgb } from '@core/utils/colorConverter'

const { global } = useTheme()

ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()

const configStore = useConfigStore()
const { isMobile } = useDevice()
if (isMobile)
  configStore.appContentLayoutNav = 'vertical'
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <ScrollToTop />
    </VApp>
  </VLocaleProvider>
</template> -->

<script setup>
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import {
  initConfigStore,
  useConfigStore,
} from '@core/stores/config'
import { hexToRgb } from '@core/utils/colorConverter'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from 'vuetify'

const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()

const configStore = useConfigStore()
const config = useRuntimeConfig()
const { isMobile } = useDevice()
if (isMobile)
  configStore.appContentLayoutNav = 'vertical'

// Ambil backgroundColor dari `definePageMeta()` atau pakai default dari Vuetify
const route = useRoute()
const pageBackground = computed(() => route.meta.backgroundColor || global.current.value.colors.background)
const isPrintLayout = computed(() => route.meta.layout === 'print')
console.log(config)
</script>

<template>
    <div v-if="isPrintLayout">
      <!-- <NuxtLayout> -->
        <NuxtPage />
      <!-- </NuxtLayout> -->
    </div>
    <div v-else>
      <VLocaleProvider :rtl="configStore.isAppRTL">
        <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}; background-color: ${pageBackground}`">
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
          <ScrollToTop />
        </VApp>
      </VLocaleProvider>
    </div>
</template>

