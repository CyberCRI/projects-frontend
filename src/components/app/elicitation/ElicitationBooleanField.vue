<template>
  <div class="elicitation-field">
    <label class="field-widget field-multi-valued-widget">
      <span class="field-label">
        {{ fieldProperty.title }}
        <span v-if="isRequired" class="is-required-mark">&nbsp;*</span>
      </span>

      <input
        class="field-input"
        type="checkbox"
        :name="fieldName"
        :checked="fieldProperty.default"
        :required="isRequired"
      />
    </label>
    <p class="field-notice">{{ fieldProperty.description }}</p>
  </div>
</template>
<script setup lang="ts">
import type { BooleanSchema } from './elicitation-types'

withDefaults(
  defineProps<{
    fieldProperty: BooleanSchema
    fieldName: string
    isRequired?: boolean
  }>(),
  { isRequired: false }
)
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';
@use './elicitation-field';
</style>
