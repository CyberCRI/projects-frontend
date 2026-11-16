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
<script setup>
const props = defineProps({
  fieldProperty: { type: Object, required: true },
  fieldName: { type: String, required: true },
  isRequired: { type: Boolean, default: false },
})

const items = computed(() =>
  props.fieldProperty.oneOf
    ? props.fieldProperty.oneOf
    : props.fieldProperty.enum.map((item) => ({ const: item, title: item }))
)

const isDefault = (item) => props.fieldProperty.default === item.const
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';
@use './elicitation-field';
</style>
