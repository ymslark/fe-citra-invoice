<script setup>
import { useAuthStore } from '@/@core/stores/auth.js'
import is from '@sindresorhus/is'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
// import logoutGif from '@images/pages/log-out-1.gif'

// const ability = useAbility()

// TODO: Get type from backend
const authStore = useAuthStore()
const userData = authStore.user

// const { signOut } = useAuth()
async function logout() {
  try {
    isLogoutDialogVisible.value = true
    isDialogVisible.value = false
    authStore.logout()
    // navigateTo({ name: 'admin-login' })
    setTimeout(() => {
    isLogoutDialogVisible.value = false
    navigateTo({ name: 'admin-login' })
  }, 2000);
  }
  catch (error) {
    throw createError(error)
  }
}

const userProfileList = [
  { type: 'divider' },
  {
    type: 'navItem',
    icon: 'tabler-user',
    title: 'Profile',
    to: {
      name: 'apps-user-view-id',
      params: { id: 21 },
    },
  },
  {
    type: 'navItem',
    icon: 'tabler-settings',
    title: 'Settings',
    to: {
      name: 'pages-account-settings-tab',
      params: { tab: 'account' },
    },
  },
] 
const isDialogVisible = ref(false)
const isLogoutDialogVisible = ref(false)

</script>

<template>
  <VBadge dot bordered location="bottom right" offset-x="1" offset-y="2" color="success">
    <VAvatar size="38" class="cursor-pointer" :color="primary" :variant="tonal">
      <VImg v-if="userData && userData.avatar" :src="userData.avatar" />
      <VIcon v-else icon="tabler-user" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="240" location="bottom end" offset="12px">
        <VList>
          <VListItem>
            <div class="d-flex gap-2 align-center">
              <VListItemAction>
                <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success" bordered>
                  <VAvatar :color="primary" :variant="tonal">
                    <VIcon icon="tabler-user" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>

              <div v-if="authStore.isLoggedIn">
                <h6 class="text-h6 font-weight-medium">
                  {{ userData.fullName || userData.username || 'Anonymous' }}
                </h6>
                <VListItemSubtitle class="text-capitalize text-disabled">
                  {{ userData.role || 'User' }}
                </VListItemSubtitle>
              </div>
            </div>
          </VListItem>

          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <!-- <template v-for="item in userProfileList" :key="item.title">
              <VListItem v-if="item.type === 'navItem'" :to="item.to">
                <template #prepend>
                  <VIcon :icon="item.icon" size="22" />
                </template>

                <VListItemTitle>{{ item.title }}</VListItemTitle>

                <template v-if="item.badgeProps" #append>
                  <VBadge rounded="sm" class="me-3" v-bind="item.badgeProps" />
                </template>
              </VListItem>

              <VDivider v-else class="my-2" />
            </template> -->

            <div class="px-4 py-2">
              <VBtn block size="small" color="error" append-icon="tabler-logout" @click="isDialogVisible = true">
                Logout
              </VBtn>
            </div>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
  <VDialog
      v-model="isDialogVisible"
      persistent
      class="v-dialog-sm"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

      <!-- Dialog Content -->
      <VCard title="Anda Yakin?">
        <VCardText class="text-h5">
          Apakah anda yakin ingin logout?
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn
            color="secondary"
            variant="tonal"
            @click="isDialogVisible = false"
          >
           Batal
          </VBtn>
          <VBtn @click="logout()">
            Logout
          </VBtn>
        </VCardText>
      </VCard>
  </VDialog>
  <!-- Dialog --> 
    <VDialog v-model="isLogoutDialogVisible" persistent class="mx-auto w-md-25 w-100 v-dialog-sm">
      <!-- Dialog close btn -->
      <VCard>
        <!-- <VCardTitle class="text-h5">
          Memuat Halaman
        </VCardTitle> -->
        <VCardText class="pt-3 text-h5 text-center">
          Logout...
          <VProgressLinear indeterminate bg-color="rgba(var(--v-theme-surface), 0.1)" :height="8" class="mb-0 mt-4" />
        </VCardText>
      </VCard>

    </VDialog>
</template>
