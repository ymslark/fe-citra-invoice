<script setup>
import {useFakturStore} from '@/stores/faktur'
import { useAlertStore } from '@/stores/alert'
import { formatTanggalIndonesia, formatRupiah } from '@/utils/format'
import is from '@sindresorhus/is'
const faktur = useFakturStore()
const route = useRoute()
const id = route.params.id || null
let document = null
let alert = useAlertStore()
const isActive = ref(true)

const isDialogConfirmVisible = ref(false)
const isRestoreDialogConfirmVisible = ref(false)
// const alert = useAlertStore()
// watch(isDialogConfirmVisible, (newVal) => {
//   console.log('Dialog visibility changed:', newVal);
// });
// watch(isActive, (newVal) => {
//   console.log('Document Aktif', newVal);
// });

if (id) {
  try {
    const {$api} = useNuxtApp()
    const response = await $api.get(`/Faktur/detail/${id}`)
    document = response.faktur
    isActive.value = document.isActive
    console.log(document)
  } catch (error) {
    console.error("Error fetching Faktur data:", error)
    // Handle error, e.g., show an alert or redirect
  }
}

async function deleteFaktur(){
  try {
    isDialogConfirmVisible.value = false
    if(!id) throw { message: 'Masukkan id faktur!!!' }
    const response = await faktur.hapusFaktur(id)
    console.log(response)
    alert.showAlertObject({
      type: 'success',
      message: 'Faktur berhasil dihapus',
    })
    isActive.value = false
    setTimeout(() => {
      navigateTo({ name: 'admin-faktur-detail-id', params: { id: id } })
    }, 3000)
  } catch (error) {
    console.error("Error deleting Faktur:", error)
    alert.showAlertObject({
      type: 'error',
      message: error.message || 'Gagal menghapus faktur',
    })
  }
}

async function restoreFaktur(){
  try {
    isRestoreDialogConfirmVisible.value = false
    if(!id) throw { message: 'Masukkan id faktur!!!' }
    const response = await faktur.restoreFaktur(id)
    console.log(response)
    alert.showAlertObject({
      type: 'success',
      message: 'Faktur berhasil direstore',
    })
    console.log(document)
    isActive.value = true
    setTimeout(() => {
      navigateTo({ name: 'admin-faktur-detail-id', params: { id: id } })
    }, 3000)
  } catch (error) {
    console.error("Error restoring Faktur:", error)
    alert.showAlertObject({
      type: 'error',
      message: error.message || 'Gagal merestore faktur',
    })
  }
}
</script>
<template>
  <div>
    <VRow>
      <!-- <VCol cols = "12" md="6">
        <VForm>
          <VCard>
            <VCardTitle>
              Detail Permintaan faktur pajak
            </VCardTitle>
            <VCardItem>
              <VRow>
                <VCol cols="12" md="6">
                  <VTextField
                    label="Nama"
                    outlined
                    clearable
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField
                    label="Alamat"
                    outlined
                    clearable
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField
                    label="NPWP"
                    outlined
                    clearable
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField
                    label="No. HP"
                    outlined
                    clearable
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField
                    label="Email"
                    outlined
                    clearable
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField
                    label="Jenis Pajak"
                    outlined
                    clearable
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField
                    label="Tanggal"
                    outlined
                    clearable
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField
                    label="No. Faktur"
                    outlined
                    clearable
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField
                    label="No. Seri"
                    outlined
                    clearable
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField
                    label="No. Pajak"
                    outlined
                    clearable
                  />
                </VCol>
              </VRow>
            </VCardItem>
          </VCard>
        </VForm>
      </VCol> -->
      <VCol cols="12" md="6" order-md="1" order="2">
        <VCard>
          <VCardText class="d-flex flex-column gap-y-6">
            <h5 class="text-h5">
              Detail Pembeli
            </h5>

            <div class="d-flex gap-x-3 align-center">
              <VAvatar
                variant="tonal"
                size="large"
              >
                <VIcon icon="tabler-user" />
              </VAvatar>
              <div>
                <h6 class="text-h6">
                 Nama
                </h6>
                <div class="text-body-1">
                 {{document.pembeli.nama_pembeli}}
                </div>
              </div>
            </div>
            <div class="d-flex gap-x-3 align-center">
              <VAvatar
                variant="tonal"
                size="large"
              >
                <VIcon icon="tabler-map-pin" />
              </VAvatar>
              <div>
                <h6 class="text-h6">
                 Alamat
                </h6>
                <div class="text-body-1">
                 {{document.pembeli.alamat}}
                </div>
              </div>
            </div>
            <div class="d-flex gap-x-3 align-center">
              <VAvatar
                variant="tonal"
                size="large"              >
                <VIcon icon="tabler-phone" />
              </VAvatar>
              <div>
                <h6 class="text-h6">
                 No. Hp
                </h6>
                <div class="text-body-1">
                 {{document.pembeli.no_hp}}
                </div>
              </div>
            </div>
            <div class="d-flex gap-x-3 align-center">
              <VAvatar
                variant="tonal"
                size="large"
              >
                <VIcon icon="tabler-receipt-tax" />
              </VAvatar>
              <div>
                <h6 class="text-h6">
                 NPWP
                </h6>
                <div class="text-body-1">
                 {{document.pembeli.npwp}}
                </div>
              </div>
            </div>
            <div class="d-flex gap-x-3 align-center">
              <VAvatar
                variant="tonal"
                size="large"
              >
                <VIcon icon="tabler-calendar" />
              </VAvatar>
              <div>
                <h6 class="text-h6">
                 Tanggal Pengajuan Faktur
                </h6>
                <div class="text-body-1">
                 {{formatTanggalIndonesia(document.tanggal)}}
                </div>
              </div>
            </div>
            <div class="d-flex gap-x-3 align-center">
              <VAvatar
                variant="tonal"
                size="large"
              >
                <VIcon icon="tabler-calendar-check" />
              </VAvatar>
              <div>
                <h6 class="text-h6">
                 Tanggal Pembelian
                </h6>
                <div class="text-body-1">
                 {{ formatTanggalIndonesia(document.tanggal_pembelian)  }}
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <!-- <VCol cols="12" md="6">
        <VCard class="mb-md-6 mb-3" >
          <VCardItem>
            <VRow>
              <VCol cols="12" md="6">
                <div class="d-flex flex-column gap-y-2">
                  <span class="text-subtitle-1 font-weight-medium">No. Faktur</span>
                  <span class="text-body-1">{{document.no_faktur}}</span>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="d-flex flex-column gap-y-2">
                  <span class="text-subtitle-1 font-weight-medium">No. Seri</span>
                  <span class="text-body-1">{{document.no_seri}}</span>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="d-flex flex-column gap-y-2">
                  <span class="text-subtitle-1 font-weight-medium">No. Pajak</span>
                  <span class="text-body-1">{{document.no_pajak}}</span>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="d-flex flex-column gap-y-2">
                  <span class="text-subtitle-1 font-weight-medium">Jenis Pajak</span>
                  <span class="text-body-1">{{document.jenis_pajak}}</span>
                </div>
              </VCol>
            </VRow>
          </VCardItem>
        </VCard>
      </VCol> -->

      <VCol cols="12" md="6" order-md="2" order="1">
        <VCard class="mb-md-6 mb-3" >
          <VCardItem>

          <div class="d-flex direction-row gap-3 flex-wrap justify-start" >
            <VBtn @click="$router.push(`/admin/faktur/print?id=${document._id}`)" color="success">
              Print
              <VIcon
                end
                icon="tabler-printer"
              />

            </VBtn>

            <VBtn color="primary" @click="$router.push(`/admin/faktur/edit/${document._id}`)">
              Edit
              <VIcon
                end
                icon="tabler-edit"
              />
            </VBtn>

            <VBtn color="error" v-if="isActive" @click="isDialogConfirmVisible = true">
              Delete
              <VIcon
                end
                icon="tabler-trash"
              />

            </VBtn>
            <VBtn color="warning" v-else @click="isRestoreDialogConfirmVisible = true">
              Restore
              <VIcon
                end
                icon="tabler-restore"
              />
            </VBtn>
          </div>

          </VCardItem>
        </VCard>
        <VCard>
          <VCardTitle>
            Gambar NPWP Pembeli
          </VCardTitle>
          <div class="d-flex justify-center pa-4">
            <VImg :src="document.pembeli.gambar_npwp"/>
          </div>
        </VCard>
      </VCol>
      <VCol cols="12" md="12" order-md="3" order="3">
        <VCard class="mb-6">
          <VCardTitle>
            Daftar Barang
          </VCardTitle>
          <VCardItem>
            <VTable fixed-header class="text-no-wrap mb-4">
              <thead>
                <tr>
                  <th class="text-uppercase">
                    No.
                  </th>
                  <th class="text-uppercase">
                    Nama Barang
                  </th>
                  <th class="text-uppercase">
                    Harga
                  </th>
                  <th class="text-uppercase">
                    Qty
                  </th>
                  <th class="text-uppercase">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(barang, index) in document.barang" :key="index">
                  <td>
                    {{ index + 1 }}
                  </td>
                  <td>
                    {{ barang.nama_barang }}
                  </td>
                  <td>
                    Rp{{ formatRupiah(barang.harga) }}
                  </td>
                  <td>
                    {{ barang.qty }}
                  </td>
                  <td>
                    Rp{{ formatRupiah(barang.harga * barang.qty) }}

                  </td>
                </tr>
              </tbody>
            </VTable>
          </VCardItem>
        </VCard>
      </VCol>
    </VRow>

    <UtilsConfirmDialog title="Anda Yakin??" message="Yakin Ingin Menghapus Data Faktur Ini??" :show="isDialogConfirmVisible" @confirm="deleteFaktur()" @cancel="isDialogConfirmVisible = false" />
    <UtilsConfirmDialog title="Anda Yakin??" message="Yakin Ingin me-restore Data Faktur Ini??" :show="isRestoreDialogConfirmVisible" @confirm="restoreFaktur()" @cancel="isRestoreDialogConfirmVisible = false" />
    <!-- <FakturPrint/> -->
  </div>
</template>
