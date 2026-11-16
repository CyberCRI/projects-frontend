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
<script setup>
defineProps({
  fieldProperty: { type: Object, required: true },
  fieldName: { type: String, required: true },
  isRequired: { type: Boolean, default: false },
})
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';
@use './elicitation-field';
</style>
