<template>
  <DoughnutChart v-bind="doughnutChartProps" />
</template>

<script>
import { DoughnutChart, useDoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { onMounted, onUnmounted, ref } from 'vue'

import { debounce } from 'es-toolkit'

Chart.register(...registerables)
export default {
  name: 'LpiDoughnutChart',

  components: {
    DoughnutChart,
  },

  props: {
    chartData: {
      type: Object,
      default: null,
    },

    options: {
      type: Object,
      default: null,
    },
  },

  setup(props) {
    const dataValue = ref(props.chartData)
    const dataOptions = ref(props.options)

    const { doughnutChartProps, doughnutChartRef } = useDoughnutChart({
      chartData: dataValue,
      options: dataOptions,
    })

    const rerenderChart = function () {
      useDoughnutChart({
        chartData: dataValue,
        options: dataOptions,
      })
    }

    onMounted(() => {
      window.addEventListener('resize', debounce(rerenderChart, 300)) // Adapt chart's size to window
    })

    onUnmounted(() => {
      window.removeEventListener('resize', debounce(rerenderChart, 300)) // Adapt chart's size to window
    })

    return {
      doughnutChartRef,
      doughnutChartProps,
    }
  },
}
</script>
