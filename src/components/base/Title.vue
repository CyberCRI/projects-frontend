<script setup lang="ts">
defineProps<{
  title: string
  count?: number
}>()
</script>

<template>
  <h2 class="title skeletons-text">
    {{ title }}
    <span v-show="count">( {{ count }} )</span>
  </h2>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.title {
  font-weight: 700;
  font-size: variables.$font-size-l;
  color: var(--primary-dark);
  margin-bottom: 1rem;
}
</style>
