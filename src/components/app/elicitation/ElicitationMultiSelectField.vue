<template>
  <div class="elicitation-field">
    <div class="field-widget field-multi-valued-widget">
      <span class="field-label">
        {{ fieldProperty.title }}
        <span v-if="isRequired" class="is-required-mark">&nbsp;*</span>
      </span>
      <div ref="options" class="options">
        <label v-for="item in items" :key="item.const">
          <input
            class="field-input"
            type="checkbox"
            :name="fieldName"
            :checked="isDefault(item)"
            :value="item.const"
            @change="validate"
          />
          <span>{{ item.title }}</span>
        </label>
      </div>
    </div>
    <p class="field-notice">{{ fieldProperty.description }}</p>
  </div>
</template>
<script setup lang="ts">
import type { ElicitationOption, MultiSelectEnumSchema } from './elicitation-types'

const { t } = useI18n()
const props = withDefaults(
  defineProps<{
    fieldProperty: MultiSelectEnumSchema
    fieldName: string
    isRequired?: boolean
  }>(),
  { isRequired: false }
)

const items = computed<ElicitationOption[]>(() => {
  const itemsDef = props.fieldProperty.items
  if ('anyOf' in itemsDef && itemsDef.anyOf) return itemsDef.anyOf
  if ('enum' in itemsDef && itemsDef.enum)
    return itemsDef.enum.map((item: string) => ({ const: item, title: item }))
  return []
})

const isDefault = (item: ElicitationOption) =>
  (props.fieldProperty.default || []).includes(item.const)

// native checkboxes can't express required / minItems / maxItems: use custom validity
const optionsEl = useTemplateRef<HTMLDivElement>('options')
const validate = () => {
  const boxes = [
    ...(optionsEl.value?.querySelectorAll<HTMLInputElement>('input[type=checkbox]') || []),
  ]
  if (!boxes.length) return
  const count = boxes.filter((b) => b.checked).length
  const min = Math.max(props.fieldProperty.minItems || 0, props.isRequired ? 1 : 0)
  const max = props.fieldProperty.maxItems
  const tooFew = count < min
  const tooMany = max != null && count > max
  boxes.forEach((b) => b.setCustomValidity(''))
  if (tooFew || tooMany) boxes[0].setCustomValidity(t('chatbot.elicitation-invalid'))
}
onMounted(validate)
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';
@use './elicitation-field';
</style>
