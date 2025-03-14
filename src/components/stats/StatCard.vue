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

<script>
export default {
  name: 'StatCard',

  props: {
    title: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.stat-card {
  border: $border-width-l solid $primary-dark;
  border-radius: $border-radius-l;
  background: $white;

  .stat-header {
    border-bottom: 3px solid $primary-dark;
    padding: $space-m $space-l;
    font-size: $font-size-m;
    font-weight: 700;
    color: $primary-dark;
  }

  .chart-ctn {
    padding: $space-m $space-l;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }
}
</style>
