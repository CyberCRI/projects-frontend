<template>
  <div class="container">
    <LpiSingleStatChart :number="stats" />
  </div>
</template>

<script setup lang="ts">
import LpiSingleStatChart from './Generic/LpiSingleStatChart.vue'

withDefaults(
  defineProps<{
    stats?: number
  }>(),
  { stats: null }
)
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
