<template>
  <LineChart v-bind="lineChartProps" />
</template>

<script setup lang="ts">
import { LineChart, useLineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { debounce } from 'es-toolkit'

Chart.register(...registerables)
defineOptions({ name: 'LpiLineChart' })

const props = withDefaults(
  defineProps<{
    chartData?: {
      datasets: any[]
    }
    options?: object
  }>(),
  { chartData: null, options: null }
)

const { lineChartProps } = useLineChart({
  chartData: props.chartData,
  options: props.options,
})

const rerenderChart = debounce(() => {
  useLineChart({
    chartData: props.chartData,
    options: props.options,
  })
}, 300)

onMounted(() => {
  window.addEventListener('resize', rerenderChart) // Adapt chart's size to window
})

onUnmounted(() => {
  window.removeEventListener('resize', rerenderChart) // Adapt chart's size to window
})
</script>
