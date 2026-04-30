<template>
  <BarChart v-bind="barChartProps" />
</template>

<script setup lang="ts">
import { onResize } from '~/composables/onResize'

import { Chart, registerables } from 'chart.js'
import { useBarChart } from 'vue-chart-3'
import type { ChartData } from 'chart.js'
import { debounce } from 'es-toolkit'

Chart.register(...registerables)

type BartChatOptions = Parameters<typeof useBarChart>[0]

const props = withDefaults(
  defineProps<{
    chartData?: ChartData<'bar', number[], unknown>
    options?: BartChatOptions['options']
  }>(),
  {
    chartData: null,
    options: null,
  }
)

const dataValue = computed(() => props.chartData)
const dataOptions = computed(() => props.options)

const { barChartProps, update } = useBarChart({
  chartData: dataValue,
  options: dataOptions,
})

onResize(
  debounce(() => {
    // Adapt chart's size to window
    update()
  }, 300)
)
</script>
