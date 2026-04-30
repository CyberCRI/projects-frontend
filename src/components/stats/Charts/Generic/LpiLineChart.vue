<template>
  <LineChart v-bind="lineChartProps" />
</template>

<script setup lang="ts">
import { onResize } from '~/composables/onResize'

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

onResize(
  debounce(() => {
    // Adapt chart's size to window
    useLineChart({
      chartData: props.chartData,
      options: props.options,
    })
  }, 300)
)
</script>
