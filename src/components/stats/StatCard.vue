<template>
  <div class="stat-card">
    <div class="stat-header">
      {{ title }}
    </div>
    <div class="chart-ctn">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: '' })
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.stat-card {
  border: variables.$border-width-l solid variables.$primary-dark;
  border-radius: variables.$border-radius-l;
  background: variables.$white;

  .stat-header {
    border-bottom: 3px solid variables.$primary-dark;
    padding: variables.$space-m variables.$space-l;
    font-size: variables.$font-size-m;
    font-weight: 700;
    color: variables.$primary-dark;
  }

  .chart-ctn {
    padding: variables.$space-m variables.$space-l;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }
}
</style>
