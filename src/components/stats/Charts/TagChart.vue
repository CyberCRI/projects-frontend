<template>
  <div class="container">
    <LpiBarChart id="tags-chart" :chart-data="chartData" :options="options" />
  </div>
</template>

<script setup lang="ts">
import useTagTexts from '~/composables/useTagTexts'

import type { Stats } from 'shared-projects-frontend/models'
import LpiBarChart from './Generic/LpiBarChart.vue'
import { CHART_COLORS } from '~/functs/constants'

const props = withDefaults(
  defineProps<{
    stats?: Stats['top_tags']
  }>(),
  {
    stats: () => [],
  }
)

const tagTexts = useTagTexts()
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

const chartData = computed(() => {
  const tagLabels = []
  const tagData = []
  const tagColors = []
  props.stats.forEach((tag, i) => {
    tagLabels.push(tagTexts.title(tag))
    tagData.push(tag.project_count)
    tagColors.push(CHART_COLORS[i % CHART_COLORS.length])
  })

  return {
    datasets: [
      {
        data: tagData,
        backgroundColor: tagColors,
      },
    ],
    labels: tagLabels,
  }
})
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables.scss';
.container {
  width: 100%;
}
</style>
