<script setup>
import { formatTanggalIndonesia } from '@/utils/format'
const route = useRoute()
const id = route.params.id
const { $api } = useNuxtApp()

let supir = {}
let memos = []
try {
  const response = await $api.get(`/supir/detail/${id}`)
  supir = response.supir
  memos = response.memo
  console.log(response)
  console.log(supir,memos)
} catch (error) {
  console.log(error)
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

</script>
<template>
  <div>
    <VRow>
      <VCol cols="12" md="6">
        <VCard>
          <VCardTitle>
            Detail Data Supir
            <!-- <iconBtn color="primary" @click="() => { }">
              <VIcon icon="tabler-trash" />
            </iconBtn> -->
          </VCardTitle>
          <VCardText>
            <VList class="card-list">

              <VListItem>
                <template #prepend>
                  <VAvatar color="alert" variant="tonal" size="34" rounded>
                    <VIcon icon="tabler-id" />
                  </VAvatar>
                </template>

                <VListItemTitle class="font-weight-medium">
                  {{ supir.nama_supir || '' }}
                </VListItemTitle>
                <VListItemSubtitle>
                  Nama
                </VListItemSubtitle>
              </VListItem>

              <VListItem>
                <template #prepend>
                  <VAvatar color="alert" variant="tonal" size="34" rounded>
                    <VIcon icon="tabler-truck" />
                  </VAvatar>
                </template>

                <VListItemTitle class="font-weight-medium">
                  {{ supir.no_kendaraan || '' }}
                </VListItemTitle>
                <VListItemSubtitle>
                  No. Kendaraan
                </VListItemSubtitle>
              </VListItem>

              <VListItem>
                <template #prepend>
                  <VAvatar color="success" variant="tonal" size="34" rounded>
                    <VIcon icon="tabler-brand-whatsapp" />
                  </VAvatar>
                </template>

                <VListItemTitle class="font-weight-medium">
                  {{ supir.no_hp || '' }}
                </VListItemTitle>
                <VListItemSubtitle>
                  Nomor Telpon
                </VListItemSubtitle>
              </VListItem>
              <!-- <VListItem>
                <template #prepend>
                  <VAvatar color="warning" variant="tonal" size="34" rounded>
                    <VIcon icon="tabler-star" />
                  </VAvatar>
                </template>

                <VListItemTitle class="font-weight-medium">
                  <VRating class="ml-3" v-model="rating" half-increment readonly color="warning" size="18" /> ({{ rating
                  }})
                </VListItemTitle>
                <VListItemSubtitle>
                  Rating
                </VListItemSubtitle>
              </VListItem> -->

              <!-- <VListItem>
                <template #prepend>
                  <VAvatar
                    color="success"
                    variant="tonal"
                    size="34"
                    rounded
                  >
                    <VIcon icon="tabler-id" />
                  </VAvatar>
                </template>
                
                <VListItemTitle class="font-weight-medium">
                  Andre
                </VListItemTitle>
                <VListItemSubtitle>
                  Rating
                </VListItemSubtitle>
              </VListItem> -->
            </VList>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VCard class="mt-4">
      <VCardTitle>
        Daftar Memo Supir
      </VCardTitle>
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
                {{ formatTanggalIndonesia(memo.tanggal) }}
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
                <!-- <VBtn size="38" class="ml-2" icon color="warning" title="Edit">
                  <VTooltip open-on-focus location="top" activator="parent">
                    Edit
                  </VTooltip>
                  <VIcon @click="navigateTo({ name: `admin-memo-edit-id`, params: { id: memo._id } })">tabler-edit
                  </VIcon>
                </VBtn> -->
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
    </VCard>
  </div>
</template>
