<script setup>
defineProps({ document: { type: Object, required: true } })
const model = defineModel({ type: Object, required: true })
</script>
<template>
  <div class="agent-document-picker">
    <div class="form-section skill-title">
      <lpiCheckbox v-model="model.useDocument" :label="document.title" />
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
