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
<script setup>
const { t } = useI18n()
const props = defineProps({
  fieldProperty: { type: Object, required: true },
  fieldName: { type: String, required: true },
  isRequired: { type: Boolean, default: false },
})

const items = computed(() =>
  props.fieldProperty.items.anyOf
    ? props.fieldProperty.items.anyOf
    : props.fieldProperty.items.enum.map((item) => ({ const: item, title: item }))
)

const isDefault = (item) => (props.fieldProperty.default || []).includes(item.const)

// native checkboxes can't express required / minItems / maxItems: use custom validity
const optionsEl = useTemplateRef('options')
const validate = () => {
  const boxes = [...(optionsEl.value?.querySelectorAll('input[type=checkbox]') || [])]
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
