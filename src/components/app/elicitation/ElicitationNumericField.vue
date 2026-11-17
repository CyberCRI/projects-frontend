<template>
  <div class="elicitation-field">
    <label class="field-widget">
      <span class="field-label">
        {{ fieldProperty.title }}
        <span v-if="isRequired" class="is-required-mark">&nbsp;*</span>
      </span>

      <input
        class="field-input"
        type="number"
        :name="fieldName"
        :value="fieldProperty.default"
        :required="isRequired"
        :step="step"
        :min="minimum"
        :max="maximum"
      />
    </label>
    <p class="field-notice">{{ fieldProperty.description }}</p>
  </div>
</template>
<script setup lang="ts">
import type { NumberSchema } from './elicitation-types'

const props = withDefaults(
  defineProps<{
    fieldProperty: NumberSchema
    fieldName: string
    isRequired?: boolean
  }>(),
  { isRequired: false }
)

const step = computed(() => (props.fieldProperty.type == 'integer' ? 1 : undefined))
const minimum = computed(() => props.fieldProperty.minimum)
const maximum = computed(() => props.fieldProperty.maximum)
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';
@use './elicitation-field';

.field-input {
  flex-grow: 1;
}
</style>
