<template>
  <div>
    <VDialog
      v-model="isDialogVisible"
      max-width="600"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

      <!-- Dialog Content -->
      <VCard title="Tambah Supir">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <AppTextField
                v-model="supir.nama"
                label="Nama"
                placeholder="Nama Lengkap"
                :rules="[requiredValidator,]"
              />
            </VCol>
            <VCol cols="12">
              <AppTextField
                v-model="supir.no_telp"
                label="Nomor Telepon"
                placeholder="Nomor Telepon"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="12">
              <AppTextField
                v-model="supir.no_kendaraan"
                label="Nomor Kendaraan"
                placeholder="Nomor Kendaraan"
                :rules="[requiredValidator,]"
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn
            variant="tonal"
            color="secondary"
            @click="isDialogVisible = false"
          >
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
            Data Supir
          </h2>
          <VBtn
            class="ml-auto d-flex"
            color="primary"
            @click="isDialogVisible = true"
          >
            Tambah Supir
          </VBtn>
        </div>
      </VCardTitle>
      <VCardItem>
        <VRow>
          <VCol
            cols="12"
            offset-md="8"
            md="4"
          />
        </VRow>
        <VTable
          v-if="surat"
          fixed-header
          class="text-no-wrap mb-4"
        >
          <thead>
            <tr>
              <th class="text-uppercase">
                No.
              </th>
              <th class="text-uppercase">
                No. Seri
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
            <tr
              v-for="(surat,index) in surat.docs"
              :key="index"
            >
              <td>
                {{ index+1 }}
              </td>
              <td>
                {{ surat.no_seri }}
              </td>
              <td>
                {{ supir.no_telp }}
              </td>
              <td>
                {{ supir.no_kendaraan }}
              </td>
              <td>
                <IconBtn
                  size="38"
                  @click="goToDetailPage(index+1)"
                >
                  <VTooltip
                    open-on-focus
                    location="top"
                    activator="parent"
                  >
                    Detail
                  </VTooltip>                  
                  <VIcon>tabler-info-circle</VIcon>
                </IconBtn>
                <IconBtn size="38">
                  <VTooltip
                    open-on-focus
                    location="top"
                    activator="parent"
                  >
                    Edit
                  </VTooltip>                  
                  <VIcon>tabler-edit</VIcon>
                </IconBtn>
                <IconBtn size="38">
                  <VTooltip
                    open-on-focus
                    location="top"
                    activator="parent"
                  >
                    Hapus
                  </VTooltip>                  
                  <VIcon>tabler-trash</VIcon>
                </IconBtn>
              </td>
            </tr>
          </tbody>
        </VTable>  
      </VCardItem>
    </VCard>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/@core/stores/auth'

definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()
const surat = false
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

const supirs = [
  {
    nama: 'John Doe',
    no_telp: '08123456789',
    no_kendaraan: 'B 1234 ABC',    
  },
  {
    nama: 'John Doe',
    no_telp: '08123456789',
    no_kendaraan: 'B 1234 ABC',    
  },
  {
    nama: 'John Doe',
    no_telp: '08123456789',
    no_kendaraan: 'B 1234 ABC',    
  },
  {
    nama: 'John Doe',
    no_telp: '08123456789',
    no_kendaraan: 'B 1234 ABC',    
  },
] 

function goToDetailPage(id){
  navigateTo(`supir/detail/${ id }`)
}

function cekButton(i, button){
  if(button == 'edit'){
    supir = supirs[i]
  }
}
onMounted(() => {
  cf.getAllSurat()
})
</script>


