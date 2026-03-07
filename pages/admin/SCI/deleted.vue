<template>
  <div>
    <VCard>
      <VCardTitle>
        <div class="">
          <h2 class="text-lg font-weight-medium d-inline">
            Data Surat Sentral Citra
          </h2>
        </div>
      </VCardTitle>
      <VCardItem>
        <VRow>
          <VCol cols="12" offset-md="8" md="4" />
        </VRow>
        <VTable fixed-header class="text-no-wrap mb-4">
          <thead>
            <tr>
              <th class="text-uppercase">
                No.
              </th>
              <th class="text-uppercase">
                No.Seri
              </th>
              <th class="text-uppercase">
                Tujuan
              </th>
              <th class="text-uppercase">
                Tanggal
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
            <tr v-for="(surat, index) in surats.docs" :key="index">
              <td>
                {{ index + 1 }}
              </td>
              <td>
                {{ surat.no_seri }}
              </td>
              <td>
                {{ surat.tujuan }}
              </td>
              <td>
                {{ formatTanggalIndonesia(surat.tanggal) }}
              </td>
              <td>
                <VIcon :color="status[surat.status].color">{{ status[surat.status].icon }}</VIcon>
                {{ surat.status }}
              </td>
              <!-- <td>
                <IconBtn size="38" @click="goToDetailPage(surat._id)">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Detail
                  </VTooltip>
                  <VIcon>tabler-info-circle</VIcon>
                </IconBtn>
                <IconBtn size="38" @click="goToEditPage(surat._id)">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Edit
                  </VTooltip>
                  <VIcon>tabler-edit</VIcon>
                </IconBtn>
                <IconBtn size="38" @click="navigateTo(`/admin/SCI/print/invoice?id=${surat._id}`)">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Hapus
                  </VTooltip>
                  <VIcon>tabler-trash</VIcon>
                </IconBtn>
              </td> -->
              <td>
                <VBtn size="38" icon color="primary" title="Detail">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Detail
                  </VTooltip>
                  <VIcon @click="goToDetailPage(surat._id)">
                    tabler-info-circle</VIcon>
                </VBtn>
                <VBtn size="38" class="ml-2" icon color="warning" title="Edit">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Edit
                  </VTooltip>
                  <VIcon @click="navigateTo({ name: `admin-SCI-edit-id`, params: { id: surat._id } })">tabler-edit
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
      </VCardItem>
    </VCard>
  </div>
</template>

<script setup>

definePageMeta({
  // middleware: 'auth.client',
  requiresAuth: true,
})
import { useSCIStore } from '@/stores/sci'
import { onMounted, ref } from 'vue'


const sci = useSCIStore()
const isDialogVisible = ref(false)
const firstName = ref('')
const middleName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const age = ref()
const interest = ref([])
let button = ''
let supir = {
  nama: '',
  no_telp: '',
  no_kendaraan: '',
}
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
let surats = await sci.getSCIDeleted()
// console.log(surats)

function goToDetailPage(id) {
  navigateTo({ name: `admin-SCI-detail-id`, params: { id } })
}

function goToEditPage(id) {
  navigateTo(`SCI/edit/${id}`)
}

// function cekButton(i, button){
//   if(button == 'edit'){
//     supir = supirs[i]
//   }
// }
onMounted(async () => {
  // // console.log(useCookie('accessToken').value)
})
</script>
