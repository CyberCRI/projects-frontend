<script setup>
const props = defineProps({ document: { type: Object, required: true } })
const model = defineModel()
</script>
<template>
  <div class="agent-document-picker">
    <div class="form-section skill-title">
      <lpiCheckbox :label="document.title" v-model="model.useDocuemnt" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.agent-document-picker {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.4rem;
}
</style>
