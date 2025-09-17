<script setup>
const props = defineProps({
  selectedRadio: {
    type: String,
    required: true,
  },
  radioContent: {
    type: Array,
    required: true,
  },
  gridColumn: {
    type: null,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(['update:selectedRadio'])

const updateSelectedOption = value => {
  if (value !== null)
    emit('update:selectedRadio', value)
}
</script>

<template>
  <!-- <VLabel class="text-h6 mb-2 border">
    Pilih Rekening
  </VLabel> -->
<div class="border border-4 border-solid border-secondary rounded pa-5">
  <div class="text-h6 mt-n2 text-center d-flex justify-center">
    {{ props.title ? props.title : 'Pilih Opsi' }}
  </div>
  
  <VRadioGroup
    v-if="props.radioContent"
    :model-value="props.selectedRadio"
    class="custom-input-wrapper"
    @update:model-value="updateSelectedOption"
  >
    <VRow>
      <VCol
        v-for="item in props.radioContent"
        :key="item.title"
        v-bind="gridColumn"
        >
        <VChip v-if="item.current"            
          color="primary"
          size="small"
        >
          {{ item.tagLine }}
        </VChip>
        <span v-else>
        <br>
        </span>
        <VLabel
        class="custom-input custom-radio-icon rounded cursor-pointer"
        :class="props.selectedRadio === item.value ? 'active' : ''"
        >
        <slot :item="item">
          <div class="d-flex flex-column align-center text-center gap-2">
              <VIcon
                v-bind="item.icon"
                class="text-high-emphasis"
              />
              <h6 class="text-h6">
                {{ item.title }}
              </h6>

              <p class="text-body-2 mb-0">
                {{ item.desc }}
              </p>
            </div>
          </slot>

          <div>
            <VRadio :value="item.value" />
          </div>
        </VLabel>
      </VCol>
    </VRow>
  </VRadioGroup>
</div>
</template>

<style lang="scss" scoped>
.custom-radio-icon {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .v-radio {
    margin-block-end: -0.5rem;
  }
}
</style>

<style lang="scss">
.custom-radio-icon {
  .v-radio {
    margin-block-end: -0.25rem;

    .v-selection-control__wrapper {
      margin-inline-start: 0;
    }
  }
}
</style>
