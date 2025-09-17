<script setup>

import '@/plugins/iconify/icons.css'
import { useConfigStore } from '@core/stores/config'
import { AppContentLayoutNav } from '@layouts/enums'
import { switchToVerticalNavOnLtOverlayNavBreakpoint } from '@layouts/utils'


import { useAuthStore } from '@/@core/stores/auth'

const DefaultLayoutWithHorizontalNav = defineAsyncComponent(() => import('./components/DefaultLayoutWithHorizontalNav.vue'))
const DefaultLayoutWithVerticalNav = defineAsyncComponent(() => import('./components/DefaultLayoutWithVerticalNav.vue'))
const configStore = useConfigStore()

// ℹ️ This will switch to vertical nav when define breakpoint is reached when in horizontal nav layout

// Remove below composable usage if you are not using horizontal nav layout in your app
switchToVerticalNavOnLtOverlayNavBreakpoint()

const { layoutAttrs, injectSkinClasses } = useSkins()

injectSkinClasses()
const ready = ref(false)
const auth = useAuthStore()
onMounted(() => {
  if (auth.isLoggedIn === false) {
    
    // navigateTo('admin-login')
    // console.log('User is not logged in, redirecting to login page')
    navigateTo({ name: 'admin-login' })
  }
  else{
    ready.value = true
  }
})
</script>

<template>
<div v-if="ready">
  <transition name="fade">
    <Component v-bind="layoutAttrs"
      :is="configStore.appContentLayoutNav === AppContentLayoutNav.Vertical ? DefaultLayoutWithVerticalNav : DefaultLayoutWithHorizontalNav">
      <Alert />
      <LoaderPage/>
      <slot />
    </Component>
</transition>
</div>
<div v-else>
    <LoaderPage/>
</div>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
@use "@core/scss/template/index.scss";
@use "@styles/styles.scss";

</style>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.logout-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 1.5rem;
}
</style>
