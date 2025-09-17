<script setup>
const supir = {
  nama: 'Andre',
  no_telpon: '089298378324',
  no_kendaraan: 'B 2341 FLR',
}
</script>
<template>
  <div>
    <VRow>
      <VCol cols="12" md="6">
        <VCard>
          <VCardTitle>
            Detail Data Nama Supir
          </VCardTitle>
          <VCardText>
            <VList class="card-list">

              <VListItem>
                <template #prepend>
                  <VAvatar
                    color="alert"
                    variant="tonal"
                    size="34"
                    rounded
                  >
                    <VIcon icon="tabler-id" />
                  </VAvatar>
                </template>
                
                <VListItemTitle class="font-weight-medium">
                  {{ supir.nama }}
                </VListItemTitle>
                <VListItemSubtitle>
                  Nama
                </VListItemSubtitle>
              </VListItem>

              <VListItem>
                <template #prepend>
                  <VAvatar
                    color="alert"
                    variant="tonal"
                    size="34"
                    rounded
                  >
                    <VIcon icon="tabler-truck" />
                  </VAvatar>
                </template>
                
                <VListItemTitle class="font-weight-medium">
                  {{ supir.no_kendaraan }}
                </VListItemTitle>
                <VListItemSubtitle>
                  No. Kendaraan
                </VListItemSubtitle>
              </VListItem>

              <VListItem>
                <template #prepend>
                  <VAvatar
                    color="success"
                    variant="tonal"
                    size="34"
                    rounded
                  >
                    <VIcon icon="tabler-brand-whatsapp" />
                  </VAvatar>
                </template>
                
                <VListItemTitle class="font-weight-medium">
                  {{ supir.no_telpon }}
                </VListItemTitle>
                <VListItemSubtitle>
                  Nomor Telpon
                </VListItemSubtitle>
              </VListItem>

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
      <VTable>

      </VTable>
    </VCard>
  </div>
</template>