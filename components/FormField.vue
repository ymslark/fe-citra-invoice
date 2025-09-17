<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  modelValue: [String, Number, Array, Object],
  rules: { type: Array, default: () => [] },
  component: { type: String, default: 'VTextField' }, // default VTextField
  items: { type: Array, default: () => [] }, // buat VSelect
  type: { type: String, default: 'text' },
  ...Object, // biar fleksibel terima semua props lain
})

const emit = defineEmits(['update:modelValue'])

// cek apakah ada requiredValidator
const computedLabel = computed(() => {
console.log(props)
  const isRequired = props.rules?.some(r => r.name === 'requiredValidator')
  return isRequired ? `${props.label} (wajib diisi)` : props.label
})
</script>

<template>
  <component
    is="VTextField"
    v-bind="{ ...$attrs, items, type }"
    :label="computedLabel"
    :rules="rules"
    :model-value="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
  </component>
</template>
