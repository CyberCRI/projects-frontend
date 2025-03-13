<template>
  <LineChart v-bind="lineChartProps" />
</template>

<script>
import { LineChart, useLineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { onMounted, onUnmounted, ref } from 'vue'

import debounce from 'lodash.debounce'

Chart.register(...registerables)
export default {
    name: 'LpiLineChart',

    components: {
        LineChart,
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

        const { lineChartProps, lineChartRef } = useLineChart({
            chartData: dataValue,
            options: dataOptions,
        })

        const rerenderChart = function () {
            useLineChart({
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
            lineChartProps,
            lineChartRef,
        }
    },
}
</script>
