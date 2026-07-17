<script lang="ts" setup>
defineProps({ agent: { type: Object, required: true } })
</script>
<template>
  <div v-if="agent?.description" class="agent-description">
    <TipTapOutput :content="agent.$t.description" />
  </div>
</template>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.agent-description {
  border-left: 3px solid variables.$primary-dark;
  border-right: 3px solid variables.$primary-dark;
  padding: 1rem;
  background-color: variables.$primary-lighter;
}
</style>
