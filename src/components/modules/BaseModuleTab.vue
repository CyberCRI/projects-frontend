<template>
  <div class="basemodule-card">
    <div class="basemodule">
      <div v-if="header" class="basemodule-header">
        <Title :title="title" :count="count" />
      </div>
      <div class="basemodule-container">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    count?: number
    header?: boolean
  }>(),
  { header: true, title: '', count: 0 }
)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.basemodule-card {
  .basemodule {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &-header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      gap: variables.$space-l;
    }

    &-container {
      width: 100%;
    }
  }
}
</style>
