<template>
  <div>
    <VDialog v-model="isDialogVisible" persistent class="v-dialog-sm">

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

      <!-- Dialog Content -->
      <VCard title="Yakin Ingin Menghapus Data Ini?">
        <VCardText>
          Data yang dihapus mungkin tidak dapat dikembalikan.
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn color="secondary" variant="tonal" @click="isDialogVisible = false">
            Batal
          </VBtn>
          <VBtn @click="isDialogVisible = false">
            Yakin
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <VCard>
      <VCardTitle>
        <div class="">
          <h2 class="text-lg font-weight-medium d-inline">
            Data Surat Jalan
          </h2>
          <VBtn class="ml-auto d-flex" color="primary" @click="navigateTo('/admin/memo/add')">
            Tambah Surat Jalan
          </VBtn>
        </div>
      </VCardTitle>
      <VCardItem>
        <VRow>
          <VCol cols="12" offset-md="8" md="4">

          </VCol>
        </VRow>
        <VTable fixed-header class="text-no-wrap mb-4">
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
              <!-- <th class="text-uppercase">
                Alamat
              </th> -->
              <th class="text-uppercase">
                Perusahaan
              </th>
              <th class="text-uppercase">
                Jenis
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
            <tr v-if="memos" v-for="(memo, index) in memos" :key="index">
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
              <!-- <td>
                {{ memo.alamat }}
              </td> -->
              <td>
                {{ memo.perusahaan }}
              </td>
              <td>
                {{ memo.jenis_memo }}
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
        <VPagination v-model="currentPage" :length="totalPages" />
      </VCardItem>
    </VCard>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp()

const isDialogVisible = ref(false)

let status = {
  'WAITING': {
    icon: 'tabler-hourglass',
    color: 'warning'
  },
  'PROCCESS': {
    icon: 'tabler-truck-delivery',
    color: 'primary'
  },
  'DONE': {
    icon: 'tabler-check',
    color: 'success'
  },
  'CANCEL': {
    icon: 'tabler-x',
    color: 'error'
  }
}
// const memos = await $api.get('/memo')
// console.log(memos.docs)

const deleteMemo = async (id) => {
  try {

    const response = await $api.delete(`/memo/${id}`)
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

function goToDetailPage(id) {
  navigateTo(`memo/detail/${id}`)
}

function goToEditPage(id) {
  navigateTo(`memo/edit/${id}`)
}

const currentPage = ref(1)
const memos = ref([])
const totalPages = ref(1)

// Ambil data dari backend, backend sudah siapkan pagination
const fetchItems = async (page = 1) => {
  try {
    const response = await $api.get(`/memo?page=${page}&limit=20`)
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
