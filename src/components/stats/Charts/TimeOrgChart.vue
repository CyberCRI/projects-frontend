<template>
    <div class="container">
        <GroupButton v-model="chartType" :options="chartTypeOptions" class="group-button" />
        <LpiLineChart id="time-org-chart" :chart-data="formattedData" :options="options" />
    </div>
</template>

<script>
import { MONTH } from '@/functs/constants.ts'
import LpiLineChart from './Generic/LpiLineChart.vue'
import GroupButton from '@/components/base/button/GroupButton.vue'

export default {
    name: 'TimeOrgChart',

    components: { LpiLineChart, GroupButton },

    props: {
        stats: {
            type: Array,
            default: () => [],
        },
    },

    computed: {
        chartTypeOptions() {
            return [
                {
                    value: 'newProjects',
                    label: this.$t('stats.new-projects'),
                },
                {
                    value: 'cumulatedProjects',
                    label: this.$t('stats.cumulated-projects'),
                },
                {
                    value: 'updatedProjects',
                    label: this.$t('stats.updated-projects'),
                },
            ]
        },
    },

    data() {
        return {
            chartType: 'newProjects',
            startDate: new Date('2021', '12', '01'),
            endDate: new Date(),
            formattedData: undefined,
            options: {
                legend: {
                    responsive: true,
                    maintainAspectRatio: true,
                    display: false,
                },
            },
        }
    },

    created() {
        this.populateDataChart()
    },

    watch: {
        chartType() {
            this.populateDataChart()
        },
    },

    methods: {
        populateDataChart() {
            const dates = this.formatDates(this.startDate, this.endDate)
            const projectsData = this.formatData(this.stats)

            this.formattedData = {
                datasets: [
                    {
                        data: projectsData,
                        borderColor: '#1d727c',
                        fill: false,
                        cubicInterpolationMode: 'monotone',
                    },
                ],
                labels: dates,
            }
        },

        formatDates(startDate, endDate) {
            const dates = []
            let currentDate = new Date(startDate)
            while (currentDate <= endDate) {
                dates.push(`${MONTH[currentDate.getMonth()]} ${currentDate.getFullYear()}`)
                currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1))
            }
            return dates
        },

        formatData(stats) {
            const statsSorted = [...stats].sort((a, b) => new Date(a.month) - new Date(b.month))
            const startIndex = statsSorted.findIndex(
                (stat) =>
                    new Date(stat.month).toLocaleDateString() ===
                    this.startDate.toLocaleDateString()
            )
            const statsByDates = statsSorted.slice(startIndex)
            // By new projects
            if (this.chartType === 'newProjects') {
                return statsByDates.map((stat) => stat.created_count)
                // By updated projects
            } else if (this.chartType === 'updatedProjects') {
                return statsByDates.map((stat) => stat.updated_count)
                // By new projects cumulated
            } else if (this.chartType === 'cumulatedProjects') {
                const formattedData = []
                statsByDates.forEach((stat) =>
                    formattedData.push(
                        stat.created_count + (formattedData[formattedData.length - 1] || 0)
                    )
                )
                return formattedData
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.container {
    .group-button {
        margin-bottom: $space-m;
    }

    #time-org-chart {
        max-width: 100%;

        :deep(canvas) {
            max-width: 100%;
        }
    }
}
</style>
