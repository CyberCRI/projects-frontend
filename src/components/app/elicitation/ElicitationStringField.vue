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
<script setup lang="ts">
import type { StringField } from './elicitation-types'

const props = withDefaults(
  defineProps<{
    fieldProperty: StringField
    fieldName: string
    isRequired?: boolean
  }>(),
  { isRequired: false }
)

const minLength = computed(() => props.fieldProperty.minLength)
const maxLength = computed(() => props.fieldProperty.maxLength)
const pattern = computed(() => props.fieldProperty.pattern)
const format = computed(() => props.fieldProperty.format || 'text')

const typeMap: Record<string, string> = {
  email: 'email',
  uri: 'url',
  date: 'date',
  'date-time': 'datetime-local',
  text: 'text',
}

const realType = computed(() => typeMap[format.value] || 'text')
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';
@use './elicitation-field';

.field-input {
  flex-grow: 1;
}
</style>
