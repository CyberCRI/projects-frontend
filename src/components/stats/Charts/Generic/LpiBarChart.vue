<template>
  <BarChart v-bind="barChartProps" />
</template>

<script setup>
import { BarChart, useBarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { debounce } from 'es-toolkit'
import { onResize } from '@/composables/onResize'

Chart.register(...registerables)
defineOptions({ name: 'LpiBarChart' })

const props = defineProps({
  chartData: {
    type: Object,
    default: null,
  },

  options: {
    type: Object,
    default: null,
  },
})

const dataValue = ref(props.chartData)
const dataOptions = ref(props.options)

const { barChartProps } = useBarChart({
  chartData: dataValue,
  options: dataOptions,
})

onResize(
  debounce(() => {
    // Adapt chart's size to window
    useBarChart({
      chartData: dataValue,
      options: dataOptions,
    })
  }, 300)
)
</script>
