<template>
  <div class="container">
    <LpiSingleStatChart :number="stats" />
  </div>
</template>

<script setup>
import LpiSingleStatChart from './Generic/LpiSingleStatChart.vue'

defineOptions({ name: 'TotalChart' })

defineProps({
  stats: {
    type: Array,
    default: () => [],
  },
})
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
