<template>
  <div>
    <VCard>
      <VCardTitle>
        <div class="">
          <h2 class="text-lg font-weight-medium d-inline">
            Data Supir
          </h2>
          <!--
            <VBtn
            class="ml-auto d-flex"
            color="primary"
            @click="isDialogVisible = true"
            >
            Tambah Supir
            </VBtn> 
          -->
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
                {{ surat.tujuan }}
              </td>
              <td>
                {{ surat.tanggal }}
              </td>
              <td>
                {{ surat.status }}
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
import { useCFStore } from "@/stores/cf"

const cf = useCFStore()

await cf.getCF()

const surat = cf.daftarSurat


const isDialogVisible = ref(false)
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
</script>


