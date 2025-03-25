<template>
  <div class="container">
    <LpiBarChart id="tags-chart" :chart-data="chartData" :options="options" />
  </div>
</template>

<script>
import { CHART_COLORS } from '@/functs/constants.ts'
import LpiBarChart from './Generic/LpiBarChart.vue'
import useTagTexts from '@/composables/useTagTexts.js'

export default {
  name: 'TagChart',

  components: { LpiBarChart },
  props: {
    stats: {
      type: Array,
      default: () => [],
    },
  },

  setup() {
    const tagTexts = useTagTexts()
    return {
      tagTexts,
    }
  },

  data() {
    return {
      chartData: undefined,
      options: {
        maintainAspectRatio: true,
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
          tagLabels.push(this.tagTexts.title(tag))
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
