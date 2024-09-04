<template>
    <div class="container">
        <LpiBarChart :chart-data="formattedData" :options="options" />
    </div>
</template>

<script>
import { CHART_COLORS } from '@/functs/constants.ts'
import LpiBarChart from './Generic/LpiBarChart.vue'
import allSdgs from '@/data/sdgs.json'

export default {
    name: 'SdgChart',

    components: { LpiBarChart },

    props: {
        stats: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            formattedData: undefined,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false,
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                    },
                },
            },
            clonedStats: this.stats,
        }
    },

    created() {
        this.populateDataChart()
    },

    methods: {
        populateDataChart() {
            const sdgsLabels = []
            const sdgsColors = []
            allSdgs.forEach((sdg, i) => {
                sdgsLabels.push(this.$t(`sdg.${sdg.id}.title`))
                sdgsColors.push(CHART_COLORS[i % CHART_COLORS.length])
            })

            const sdgsData = [...this.stats]
                .sort((a, b) => parseInt(a.sdg) - parseInt(b.sdg))
                .map((item) => item.project_count)

            this.formattedData = {
                datasets: [
                    {
                        data: sdgsData,
                        backgroundColor: sdgsColors,
                    },
                ],
                labels: sdgsLabels,
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
}
</style>
