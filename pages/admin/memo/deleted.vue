<template>
  <div>
    <VDialog v-model="isDialogVisible" max-width="600">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

      <!-- Dialog Content -->
      <VCard title="Tambah Supir">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <AppTextField v-model="firstName" label="Nama" placeholder="Nama Lengkap" :rules="[requiredValidator,]" />
            </VCol>
            <VCol cols="12">
              <AppTextField v-model="email" label="Nomor Telepon" placeholder="Nomor Telepon"
                :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12">
              <AppTextField v-model="password" label="Nomor Kendaraan" placeholder="Nomor Kendaraan"
                :rules="[requiredValidator,]" />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn variant="tonal" color="secondary" @click="isDialogVisible = false">
            Close
          </VBtn>
          <VBtn @click="isDialogVisible = false">
            Save
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <VCard>
      <VCardTitle>
        <div class="">
          <h2 class="text-lg font-weight-medium d-inline">
            Data Memo
          </h2>
          <VBtn class="ml-auto d-flex" color="primary" @click="isDialogVisible = true">
            Tambah Memo
          </VBtn>
        </div>
      </VCardTitle>
      <VCardItem>
        <VRow>
          <VCol cols="12" v-if="memos.length == 0">
            <h4 class="text-lg font-weight-medium d-inline">
              Tidak Ada Data
            </h4>
          </VCol>
        </VRow>
        <VTable v-if="memos.length > 0" fixed-header class="text-no-wrap mb-4">
          <thead>
            <tr>
              <th class="text-uppercase">
                No.
              </th>
              <th class="text-uppercase">
                Tujuan
              </th>
              <th class="text-uppercase">
                Tanggal
              </th>
              <th class="text-uppercase">
                Nama Supir
              </th>
              <th class="text-uppercase">
                Alamat
              </th>
              <th class="text-uppercase">
                Perusahaan
              </th>
              <th class="text-uppercase">
                Status
              </th>
              <th class="text-uppercase">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="memos.length > 0" v-for="(memo, index) in memos" :key="index">
              <td>
                {{ index + 1 }}
              </td>
              <td>
                {{ memo.tujuan }}
              </td>
              <td>
                {{ memo.tanggal }}
              </td>
              <td>
                {{ memo.supir.nama_supir }}
              </td>
              <td>
                {{ memo.alamat }}
              </td>
              <td>
                {{ memo.perusahaan }}
              </td>
              <td>
                <VIcon :color="status[memo.status].color">{{ status[memo.status].icon }}</VIcon>
                {{ memo.status }}
              </td>
              <td>
                <VBtn size="38" icon color="primary" title="Detail">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Detail
                  </VTooltip>
                  <VIcon @click="navigateTo({ name: `admin-memo-detail-id`, params: { id: memo._id } })">
                    tabler-info-circle</VIcon>
                </VBtn>
                <VBtn size="38" class="ml-2" icon color="warning" title="Edit">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Edit
                  </VTooltip>
                  <VIcon @click="navigateTo({ name: `admin-memo-edit-id`, params: { id: memo._id } })">tabler-edit
                  </VIcon>
                </VBtn>
                <!-- <VBtn size="38" class="ml-2" icon color="error" title="Hapus">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Hapus
                  </VTooltip>
                  <VIcon>tabler-trash</VIcon>
                </VBtn> -->
              </td>
            </tr>
          </tbody>
        </VTable>
        <VPagination v-if="memos.length > 0" v-model="currentPage" :length="totalPages" />
      </VCardItem>
    </VCard>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp()

const isDialogVisible = ref(false)
const firstName = ref('')
const middleName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const age = ref()
const interest = ref([])
let status = {
  'WAITING': {
    icon: 'tabler-hourglass',
    color: 'warning'
  },
  'APPROVED': {
    icon: 'tabler-check',
    color: 'success'
  },
  'REJECTED': {
    icon: 'tabler-x',
    color: 'error'
  },
  'CANCELED': {
    icon: 'tabler-x',
    color: 'error'
  }
}
// const memos = await $api.get('/memo/deleted')
// console.log(memos.docs)

const currentPage = ref(1)
const memos = ref([])
const totalPages = ref(1)

// Ambil data dari backend, backend sudah siapkan pagination
const fetchItems = async (page = 1) => {
  try {
    const response = await $api.get(`/memo/deleted?page=${page}&limit=2`)
    console.log(response)
    memos.value = response.docs
    totalPages.value = response.totalPages // backend kirim total halaman
    console.log(memos.value)
  } catch (error) {
    console.error('Gagal mengambil data:', error)
  }
}

watch(currentPage, (page) => {
  fetchItems(page)
})

fetchItems(currentPage.value)
</script>
