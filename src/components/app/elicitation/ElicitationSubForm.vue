<template>
  <div class="subform">
    <p class="subform-message">{{ message }}</p>

    <div v-for="propertyKey in propertyKeys" :key="propertyKey" class="field">
      <!-- string -->
      <ElicitationStringField
        v-if="isStringField(propertyKey)"
        :field-name="fieldName(propertyKey)"
        :field-property="properties[propertyKey]"
        :is-required="isRequired(propertyKey)"
      />
      <!-- number and integer -->
      <ElicitationNumericField
        v-else-if="isNumericField(propertyKey)"
        :field-name="fieldName(propertyKey)"
        :field-property="properties[propertyKey]"
        :is-required="isRequired(propertyKey)"
      />
      <!-- boolean -->
      <ElicitationBooleanField
        v-else-if="isBooleanField(propertyKey)"
        :field-name="fieldName(propertyKey)"
        :field-property="properties[propertyKey]"
        :is-required="isRequired(propertyKey)"
      />
      <!-- single select enum -->
      <ElicitationSingleSelectField
        v-else-if="isSingleSelectField(propertyKey)"
        :field-name="fieldName(propertyKey)"
        :field-property="properties[propertyKey]"
        :is-required="isRequired(propertyKey)"
      />
      <!-- multi select enum -->
      <ElicitationMultiSelectField
        v-else-if="isMultiSelectField(propertyKey)"
        :field-name="fieldName(propertyKey)"
        :field-property="properties[propertyKey]"
        :is-required="isRequired(propertyKey)"
      />
      <!-- unknown -->
      <ElicitationUnknownField
        v-else
        :field-name="fieldName(propertyKey)"
        :field-property="properties[propertyKey]"
        :is-required="isRequired(propertyKey)"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  requestKey: { type: String, required: true },
  requestBody: { type: Object, required: true },
})

const message = computed(() => props.requestBody?.message || '')

const requestedSchema = computed(() => props.requestBody?.requestedSchema || {})

const properties = computed(() => requestedSchema.value?.properties || {})
const propertyKeys = computed(() => Object.keys(properties.value))

const fieldName = (propertyKey) => `${props.requestKey}[${propertyKey}]`

const isRequired = (propertyKey) => (requestedSchema.value.required || []).includes(propertyKey)

const isStringField = (propertyKey) =>
  properties.value[propertyKey]?.type == 'string' &&
  !properties.value[propertyKey].enum &&
  !properties.value[propertyKey].oneOf

const isNumberField = (propertyKey) => properties.value[propertyKey]?.type == 'number'
const isIntegerField = (propertyKey) => properties.value[propertyKey]?.type == 'integer'
const isNumericField = (propertyKey) => isNumberField(propertyKey) || isIntegerField(propertyKey)

const isBooleanField = (propertyKey) => properties.value[propertyKey]?.type == 'boolean'

const isSingleSelectField = (propertyKey) =>
  properties.value[propertyKey]?.type == 'string' &&
  (properties.value[propertyKey].oneOf || properties.value[propertyKey].enum)

const isMultiSelectField = (propertyKey) =>
  properties.value[propertyKey]?.type == 'array' && properties.value[propertyKey].items
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
