<template>
  <DoughnutChart v-bind="doughnutChartProps" />
</template>

<script setup>
import { DoughnutChart, useDoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { debounce } from 'es-toolkit'
import { onResize } from '@/composables/onResize'

Chart.register(...registerables)
defineOptions({ name: 'LpiDoughnutChart' })

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

const { doughnutChartProps } = useDoughnutChart({
  chartData: dataValue,
  options: dataOptions,
})

onResize(
  debounce(() => {
    // Adapt chart's size to window
    useDoughnutChart({
      chartData: dataValue,
      options: dataOptions,
    })
  }, 300)
)
</script>
