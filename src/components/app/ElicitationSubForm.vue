<template>
  <div class="subform">
    <p class="subform-message">{{ message }}</p>

    <div v-for="propertyKey in propertyKeys" :key="propertyKey" class="field">
      <label class="field-widget">
        <span class="field-label">{{ properties[propertyKey]?.title }}</span>
        <input
          class="filed-input"
          type="checkbox"
          v-if="properties[propertyKey]?.type == 'boolean'"
          :name="fieldName(propertyKey)"
        />
        <input
          class="filed-input"
          type="text"
          v-if="properties[propertyKey]?.type == 'string'"
          :name="fieldName(propertyKey)"
        />
      </label>
      <p class="field-notice">{{ properties[propertyKey]?.description }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ requestKey: String, requestBody: Object })
const model = defineModel()

const message = computed(() => props.requestBody?.message || '')

const requestedSchema = computed(() => props.requestBody?.requestedSchema || {})

const properties = computed(() => requestedSchema.value?.properties || {})
const propertyKeys = computed(() => Object.keys(properties.value))

const fieldName = (propertyKey) => `${props.requestKey}[${propertyKey}]`
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

$form-guuter: 0.6rem;

.subform-message {
  background-color: variables.$primary-lighter;
  padding: $form-guuter;
  border-radius: 0.4rem;
  margin-block: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.field {
  margin-inline: $form-guuter;
}

.field ~ .field {
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  border-top: 1px solid variables.$light-gray;
}

.field-label {
  font-weight: 600;
}

.field-widget {
  display: flex;
  gap: 1rem;
}

.field-notice {
  font-variant: italic;
  forn-size: 0.8rem;
}
</style>
