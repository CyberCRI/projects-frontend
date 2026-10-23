<template>
  <span class="domain-item">
    <PieProgress class="progress" :progress="domain.progress" />
    <span class="domain-label">{{ domain.label }}</span>
  </span>
</template>
<script lang="ts" setup>
defineProps<{ domain: { id: number; label: string; progress: number } }>()
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.domain-item {
  display: inline-flex;
  align-items: center;
  flex-basis: max-content;
  flex-grow: 0;
  gap: 0.6rem;
  border-radius: 1rem;
  background-color: variables.$primary-lighter;
  padding: 0.4rem 0.8rem;
  color: variables.$primary-dark;
  font-size: 0.8rem;
}

.progress {
  width: 1em;
  height: 1em;
  fill: variables.$primary-dark;
}
</style>
