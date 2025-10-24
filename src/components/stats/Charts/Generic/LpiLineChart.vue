<template>
  <LineChart v-bind="lineChartProps" />
</template>

<script setup>
import { LineChart, useLineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { debounce } from 'es-toolkit'

Chart.register(...registerables)
defineOptions({ name: 'LpiLineChart' })

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

const { lineChartProps } = useLineChart({
  chartData: dataValue,
  options: dataOptions,
})

const rerenderChart = debounce(() => {
  useLineChart({
    chartData: dataValue,
    options: dataOptions,
  })
}, 300)

onMounted(() => {
  window.addEventListener('resize', rerenderChart) // Adapt chart's size to window
})

onUnmounted(() => {
  window.removeEventListener('resize', rerenderChart) // Adapt chart's size to window
})
</script>
