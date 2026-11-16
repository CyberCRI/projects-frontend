<template>
  <ElicitationStringField
    :field-name="fieldName"
    :field-property="fieldProperty"
    :is-required="isRequired"
  />
</template>
<script setup>
const props = defineProps({
  fieldProperty: { type: Object, required: true },
  fieldName: { type: String, required: true },
  isRequired: { type: Boolean, default: false },
})

console.warn('ELicitation field: unknown type', props)
</script>
