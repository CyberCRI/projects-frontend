<template>
  <BarChart v-bind="barChartProps" />
</template>

<script>
import { BarChart, useBarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { onMounted, onUnmounted, ref } from 'vue'

import debounce from 'lodash.debounce'

Chart.register(...registerables)
export default {
    name: 'LpiBarChart',

    components: {
        BarChart,
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

        const { barChartProps, barChartRef } = useBarChart({
            chartData: dataValue,
            options: dataOptions,
        })

        const rerenderChart = function () {
            useBarChart({
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
            barChartRef,
            barChartProps,
        }
    },
}
</script>
