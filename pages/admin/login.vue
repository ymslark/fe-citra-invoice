<script setup>
import { useAuthStore } from '@/@core/stores/auth'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { VForm } from 'vuetify/components/VForm'

const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

definePageMeta({
  layout: 'blank',
  unauthenticatedOnly: true,
})



const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()
const isPasswordVisible = ref(false)
const rememberMe = ref(false)
const route = useRoute()

// const errors = ref({
//   email: undefined,
//   password: undefined,
// })

const refVForm = ref()

// const credentials = ref({
//   email: 'admin@demo.com',
//   password: 'admin',
// })

const login = async () => {
  try {
    // console.log(username, password)

    const isLoggedIn = await authStore.login({ username: username.value, password: password.value })
    if (!isLoggedIn) throw { message: 'Login Gagal! periksa username dan password anda' }
    // console.log(isLoggedIn)
    if (isLoggedIn) navigateTo({ name: 'admin-supir' })
  } catch (error) {
    errorMessage.value = error.message
    setTimeout(() => {
      errorMessage.value = null
    }, 2000)
  }
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      login()
  })
}
</script>

<!-- ❗Errors in the form are set on line 60 -->
<template>
  <NuxtLink to="/" >
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </NuxtLink>
  
  <VRow no-gutters class="auth-wrapper bg-surface mt-n16">
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background w-100 me-0">
        <div class="d-flex align-center justify-center w-100 h-100" style="padding-inline: 6.25rem;">
          <VImg max-width="613" :src="authThemeImg" class="auth-illustration mt-16 mb-2" />
        </div>
        <img class="auth-footer-mask" :src="authThemeMask" alt="auth-footer-mask" height="280" width="100">
      </div>
    </VCol>

    <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <h4 class="text-h4 mb-1">
            Login <span class="text-capitalize"> {{ themeConfig.app.title }} <VIcon>tabler-login-2</VIcon> </span>
          </h4>
          
        </VCardText>
        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VAlert v-if="errorMessage" type="error" close-delay="2">
                  {{ errorMessage }}
                </VAlert>
              </VCol>
              <VCol cols="12">
                <AppTextField v-model="username" label="Username" placeholder="citra990" autofocus
                  :rules="[requiredValidator]" />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField v-model="password" label="Password" placeholder="············"
                  :rules="[requiredValidator]" :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />

                <!-- <div class="d-flex align-center flex-wrap justify-space-between my-6">
                  <VCheckbox v-model="rememberMe" label="Remember me" />
                </div> -->

                <VBtn block type="submit" class="mt-6">
                  Login
                </VBtn>
              </VCol>

              <!-- create account -->
            </VRow>
          </VForm>

        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
