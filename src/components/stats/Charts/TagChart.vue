<template>
    <div class="container">
        <LpiBarChart id="tags-chart" :chart-data="chartData" :options="options" />
    </div>
</template>

<script>
import { CHART_COLORS } from '@/functs/constants.ts'
import LpiBarChart from './Generic/LpiBarChart.vue'
import useLanguagesStore from '@/stores/useLanguages'

export default {
    name: 'TagChart',

    components: { LpiBarChart },

    setup() {
        const languagesStore = useLanguagesStore()
        return {
            languagesStore,
        }
    },
    props: {
        stats: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            chartData: undefined,
            language: this.languagesStore.current,
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            display: false,
                        },
                    },
                },
            },
        }
    },

    created() {
        this.populateDataChart()
    },

    methods: {
        populateDataChart() {
            if (this.stats.length) {
                const tagLabels = []
                const tagData = []
                const tagColors = []
                this.stats.forEach((tag, i) => {
                    tagLabels.push(tag[`name_${this.language}`] || tag.name)
                    tagData.push(tag.project_count)
                    tagColors.push(CHART_COLORS[i % CHART_COLORS.length])
                })

                this.chartData = {
                    datasets: [
                        {
                            data: tagData,
                            backgroundColor: tagColors,
                        },
                    ],
                    labels: tagLabels,
                }
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
}
</style>
