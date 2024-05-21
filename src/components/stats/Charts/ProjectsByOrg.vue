<template>
    <div class="projects-by-org">
        <LpiDoughnutChart id="organisations-chart" :chart-data="formattedData" :options="options" />
    </div>
</template>

<script>
import { CHART_COLORS } from '@/functs/constants.ts'
import LpiDoughnutChart from './Generic/LpiDoughnutChart.vue'

export default {
    name: 'ProjectsByOrg',

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
                maintainAspectRatio: true,
                hover: {
                    onHover: (_, el) => {
                        document.getElementById('organisations-chart').style.cursor = el[0]
                            ? 'pointer'
                            : 'default'
                    },
                },
            },
        }
    },

    created() {
        const totalProjects = {
            total: this.stats.reduce((acc, cur) => acc + cur.project_count, 0),
        }
        const projectsByOrgs = { total: totalProjects, org: this.stats }
        this.populateDataChart(projectsByOrgs, totalProjects.total)
    },

    methods: {
        populateDataChart(projects, total) {
            const orgsData = [total - projects.total]
            const orgsLabels = []
            const orgsCodes = []
            const colors = []
            projects.org.forEach((data, i) => {
                orgsData.push(data.project_count)
                orgsLabels.push(data.name)
                orgsCodes.push(data.code)
                colors.push(CHART_COLORS[i % CHART_COLORS.length])
            })
            this.formattedData = {
                datasets: [
                    {
                        data: orgsData,
                        backgroundColor: colors,
                        orgCode: orgsCodes,
                    },
                ],
                labels: orgsLabels,
            }
        },
    },

    components: {
        LpiDoughnutChart,
    },
}
</script>
