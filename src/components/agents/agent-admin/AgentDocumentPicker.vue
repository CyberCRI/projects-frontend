<script setup>
defineProps({ document: { type: Object, required: true } })
const model = defineModel({ type: Object, required: true })
</script>
<template>
  <div class="agent-document-picker">
    <lpiCheckbox class="doc-field" v-model="model.useDocument" :label="document.title" />
    <VectorStoreGlobalPill v-if="document.org_code == ''" class="global-pill" />
  </div>
</template>

<style lang="scss" scoped>
.agent-document-picker {
  display: flex;
  align-items: center;
  flex-direction: row no-wrap;
  gap: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.4rem;
}
.doc-field {
  flex-grow: 1;
}
.global-pill {
  flex-shrink: 0;
}
</style>
