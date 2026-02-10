<script setup>
import navItems from '@/navigation/vertical'
import { themeConfig } from '@themeConfig'
import {useAuthStore} from '@/@core/stores/auth.js'
// Components
import Footer from '@/layouts/components/Footer.vue'
import NavBarNotifications from '@/layouts/components/NavBarNotifications.vue'
import NavSearchBar from '@/layouts/components/NavSearchBar.vue'
import NavbarShortcuts from '@/layouts/components/NavbarShortcuts.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import NavBarI18n from '@core/components/I18n.vue'

const authStore = useAuthStore()
let role = authStore.user ? authStore.user.role : 'guest'
// @layouts plugin
import { VerticalNavLayout } from '@layouts'
import RequestLinkList from '@/components/RequestLinkList.vue'

const toConfig = () => {
  // Navigate to the configuration page
  useRouter().push({ name: 'admin-config-index' })
}
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn
          id="vertical-nav-toggle-btn"
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon
            size="26"
            icon="tabler-menu-2"
          />
        </IconBtn>

        <!-- <NavSearchBar class="ms-lg-n3" /> -->

        <VSpacer />

        <!-- <NavBarI18n
          v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
          :languages="themeConfig.app.i18n.langConfig"
        /> -->
        <RequestLinkList />
        <NavbarThemeSwitcher />
        <!-- <NavbarShortcuts /> -->
        <!-- <NavBarNotifications class="me-1" /> -->
        <UserProfile />
        <!-- <VBtn icon="tabler-settings" /> -->
        <IconBtn @click="navigateTo({ name: 'admin-config'})" class="ms-2" v-if="role.includes('super_admin', 'developer')"> 
          <VTooltip open-on-focus location="bottom" activator="parent" >
            Configuration
          </VTooltip>
          <VIcon>tabler-settings</VIcon>
        </IconBtn>
        
      </div>
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
    <!-- <div>Anu</div> -->
  </VerticalNavLayout>
</template>
