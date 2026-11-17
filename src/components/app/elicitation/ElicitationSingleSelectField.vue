<template>
  <div class="elicitation-field">
    <div class="field-widget field-multi-valued-widget">
      <span class="field-label">
        {{ fieldProperty.title }}
        <span v-if="isRequired" class="is-required-mark">&nbsp;*</span>
      </span>
      <!-- TODO: handle required -->
      <div class="options">
        <label v-for="item in items" :key="item.const">
          <input
            class="field-input"
            type="radio"
            :name="fieldName"
            :checked="isDefault(item)"
            :required="isRequired"
            :value="item.const"
          />
          <span>{{ item.title }}</span>
        </label>
      </div>
    </div>
    <p class="field-notice">{{ fieldProperty.description }}</p>
  </div>
</template>
<script setup lang="ts">
import type { ElicitationOption, SingleSelectEnumSchema } from './elicitation-types'

const props = withDefaults(
  defineProps<{
    fieldProperty: SingleSelectEnumSchema
    fieldName: string
    isRequired?: boolean
  }>(),
  { isRequired: false }
)

const items = computed<ElicitationOption[]>(() => {
  const property = props.fieldProperty
  if ('oneOf' in property && property.oneOf) return property.oneOf
  if ('enum' in property && property.enum)
    return property.enum.map((item: string) => ({ const: item, title: item }))
  return []
})

const isDefault = (item: ElicitationOption) => props.fieldProperty.default === item.const
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';
@use './elicitation-field';
</style>
