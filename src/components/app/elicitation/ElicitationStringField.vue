<template>
  <div class="elicitation-field">
    <label class="field-widget">
      <span class="field-label">
        {{ fieldProperty.title }}
        <span v-if="isRequired" class="is-required-mark">&nbsp;*</span>
      </span>
      <input
        class="field-input"
        :type="realType"
        :name="fieldName"
        :value="fieldProperty.default"
        :required="isRequired"
        :minlength="minLength"
        :maxlength="maxLength"
        :pattern="pattern"
      />
    </label>
    <p class="field-notice">{{ fieldProperty.description }}</p>
  </div>
</template>
<script setup>
const props = defineProps({
  fieldProperty: { type: Object, required: true },
  fieldName: { type: String, required: true },
  isRequired: { type: Boolean, default: false },
})

const minLength = computed(() => props.fieldProperty.minLength)
const maxLength = computed(() => props.fieldProperty.maxLength)
const pattern = computed(() => props.fieldProperty.pattern)
const format = computed(() => props.fieldProperty.format || 'text')

const realType = computed(() => {
  const typeMap = {
    email: 'email',
    uri: 'url',
    date: 'date',
    'date-time': 'datetime-local',
    text: 'text',
  }

  return typeMap[format.value] || 'text'
})
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';
@use './elicitation-field';

.field-input {
  flex-grow: 1;
}
</style>
