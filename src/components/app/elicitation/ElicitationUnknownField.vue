<template>
  <ElicitationStringField
    :field-name="fieldName"
    :field-property="asStringField"
    :is-required="isRequired"
  />
</template>
<script setup lang="ts">
import type { PrimitiveSchemaDefinition, StringField } from './elicitation-types'

const props = withDefaults(
  defineProps<{
    fieldProperty: PrimitiveSchemaDefinition
    fieldName: string
    isRequired?: boolean
  }>(),
  { isRequired: false }
)

// fallback: unknown types are rendered as a plain text input
const asStringField = computed(() => props.fieldProperty as unknown as StringField)

console.warn('ELicitation field: unknown type', props)
</script>
