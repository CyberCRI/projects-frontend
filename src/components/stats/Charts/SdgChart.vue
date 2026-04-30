<template>
  <div class="container">
    <LpiBarChart :chart-data="formattedData" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { CHART_COLORS, SDGS } from '~/functs/constants'
import LpiBarChart from './Generic/LpiBarChart.vue'
import type { Stats } from '~/api/stats.service'

const props = withDefaults(
  defineProps<{
    stats?: Stats['by_sdg']
  }>(),
  {
    stats: () => [],
  }
)

const { t } = useNuxtI18n()

const formattedData = ref(undefined)
const options = ref({
  responsive: true,
  maintainAspectRatio: true,
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
})

const populateDataChart = () => {
  const sdgsLabels = []
  const sdgsColors = []
  SDGS.forEach((sdg, i) => {
    sdgsLabels.push(t(`sdg.${sdg.id}.title`))
    sdgsColors.push(CHART_COLORS[i % CHART_COLORS.length])
  })

  const sdgsData = [...props.stats].sort((a, b) => a.sdg - b.sdg).map((item) => item.project_count)

  formattedData.value = {
    datasets: [
      {
        data: sdgsData,
        backgroundColor: sdgsColors,
      },
    ],
    labels: sdgsLabels,
  }
}

onMounted(() => populateDataChart())
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
