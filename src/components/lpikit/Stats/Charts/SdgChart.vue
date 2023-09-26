<template>
    <div class="container">
        <LpiBarChart :chart-data="formattedData" :options="options" />
    </div>
</template>

<script>
import { CHART_COLORS } from '@/functs/constants.ts'
import LpiBarChart from './Generic/LpiBarChart.vue'

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
            // TODO: replace the following array by store getter 'sdgs/all'
            sdgs: [
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { id: 4 },
                { id: 5 },
                { id: 6 },
                { id: 7 },
                { id: 8 },
                { id: 9 },
                { id: 10 },
                { id: 11 },
                { id: 12 },
                { id: 13 },
                { id: 14 },
                { id: 15 },
                { id: 16 },
                { id: 17 },
            ],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                    xAxes: [
                        {
                            gridLines: {
                                display: false,
                            },
                        },
                    ],
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
            this.sdgs.forEach((sdg, i) => {
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
