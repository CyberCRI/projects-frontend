<template>
  <div class="container">
    <LpiBarChart id="tags-chart" :chart-data="chartData" :options="options" />
  </div>
</template>

<script setup lang="ts">
import useTagTexts from '~/composables/useTagTexts'

import LpiBarChart from './Generic/LpiBarChart.vue'
import { CHART_COLORS } from '~/functs/constants'
import type { Stats } from '~/api/stats.service'

const props = withDefaults(
  defineProps<{
    stats?: Stats['top_tags']
  }>(),
  {
    stats: () => [],
  }
)

const tagTexts = useTagTexts()
const chartData = ref(undefined)
const options = ref({
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
})

const populateDataChart = () => {
  if (props.stats.length) {
    const tagLabels = []
    const tagData = []
    const tagColors = []
    props.stats.forEach((tag, i) => {
      tagLabels.push(tagTexts.title(tag))
      tagData.push(tag.project_count)
      tagColors.push(CHART_COLORS[i % CHART_COLORS.length])
    })

    chartData.value = {
      datasets: [
        {
          data: tagData,
          backgroundColor: tagColors,
        },
      ],
      labels: tagLabels,
    }
  }
}

onMounted(() => {
  populateDataChart()
})
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
}
</style>
