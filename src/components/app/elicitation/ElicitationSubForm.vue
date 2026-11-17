<template>
  <div class="subform">
    <p class="subform-message">{{ message }}</p>

    <div v-for="{ key, def } in fields" :key="key" class="field">
      <!-- string -->
      <ElicitationStringField
        v-if="isStringField(def)"
        :field-name="fieldName(key)"
        :field-property="def"
        :is-required="isRequired(key)"
      />
      <!-- number and integer -->
      <ElicitationNumericField
        v-else-if="isNumericField(def)"
        :field-name="fieldName(key)"
        :field-property="def"
        :is-required="isRequired(key)"
      />
      <!-- boolean -->
      <ElicitationBooleanField
        v-else-if="isBooleanField(def)"
        :field-name="fieldName(key)"
        :field-property="def"
        :is-required="isRequired(key)"
      />
      <!-- single select enum -->
      <ElicitationSingleSelectField
        v-else-if="isSingleSelectField(def)"
        :field-name="fieldName(key)"
        :field-property="def"
        :is-required="isRequired(key)"
      />
      <!-- multi select enum -->
      <ElicitationMultiSelectField
        v-else-if="isMultiSelectField(def)"
        :field-name="fieldName(key)"
        :field-property="def"
        :is-required="isRequired(key)"
      />
      <!-- unknown -->
      <ElicitationUnknownField
        v-else
        :field-name="fieldName(key)"
        :field-property="def"
        :is-required="isRequired(key)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  isBooleanField,
  isMultiSelectField,
  isNumericField,
  isSingleSelectField,
  isStringField,
  type ElicitationRequestBody,
  type PrimitiveSchemaDefinition,
} from './elicitation-types'

const props = defineProps<{
  requestKey: string
  requestBody: ElicitationRequestBody
}>()

const message = computed(() => props.requestBody?.message || '')

const requestedSchema = computed(() => props.requestBody?.requestedSchema)

const fields = computed(() =>
  Object.entries(
    (requestedSchema.value?.properties || {}) as Record<string, PrimitiveSchemaDefinition>
  ).map(([key, def]) => ({ key, def }))
)

const fieldName = (propertyKey: string) => `${props.requestKey}[${propertyKey}]`

const isRequired = (propertyKey: string) =>
  (requestedSchema.value?.required || []).includes(propertyKey)
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

$form-gutter: 0.6rem;

.subform-message {
  background-color: variables.$primary-lighter;
  padding: $form-gutter;
  border-radius: 0.4rem;
  margin-block: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.field {
  margin-inline: $form-gutter;
  padding-inline: 0.5rem;
  border-left: 3px solid variables.$primary;

  &:has(input:invalid) {
    border-color: variables.$salmon;
  }
}

.field ~ .field {
  margin-top: 1rem;
}
</style>
