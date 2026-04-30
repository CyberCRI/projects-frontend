<template>
  <BarChart v-bind="barChartProps" />
</template>

<script setup lang="ts">
import { onResize } from '~/composables/onResize'

import { BarChart, useBarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
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

const dataValue = computed(() => ({
  datasets: [],
  ...(toRaw(props.chartData) ?? {}),
}))
const dataOptions = computed(() => toRaw(props.options))

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
