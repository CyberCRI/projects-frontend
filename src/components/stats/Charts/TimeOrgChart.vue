<template>
  <div class="container">
    <LpiLineChart :chart-data="formattedData" :options="OPTIONS" />
  </div>
</template>

<script setup lang="ts">
import LpiLineChart from './Generic/LpiLineChart.vue'

const props = withDefaults(
  defineProps<{
    stats?: any[]
  }>(),
  { stats: () => [] }
)

const OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  legend: {
    display: false,
  },
}
const { t, locale } = useNuxtI18n()

const formatedDates = computed(() => {
  const startDate = new Date(2021, 12, 1)
  const endDate = new Date()

  const dates = []
  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate.setMonth(currentDate.getMonth() + 1)
  ) {
    // currentDate would otherwise be a reference to the same object, over and over
    dates.push(new Date(currentDate))
  }
  return dates
})

const newFormatDates = computed(() => {
  const dates = formatedDates.value
  const formater = new Intl.DateTimeFormat(locale.value, { month: 'long', year: 'numeric' })
  return dates.map((date) => formater.format(date))
})

const newFormatData = computed(() => {
  const dates = formatedDates.value
  const statsDate = props.stats.map((stat) => new Date(stat.month))
  const data = { created: [], updated: [] }

  for (const date of dates) {
    const index = statsDate.findIndex(
      (statDate) => statDate.toLocaleDateString() === date.toLocaleDateString()
    )
    if (index !== -1) {
      data.created.push(props.stats[index].created_count)
      data.updated.push(props.stats[index].updated_count)
    } else {
      data.created.push(0)
      data.updated.push(0)
    }
  }
  return data
})

const formattedData = computed(() => {
  return {
    datasets: [
      {
        data: newFormatData.value.created,
        borderColor: '#01910f',
        fill: false,
        cubicInterpolationMode: 'monotone',
        label: t('stats.created'),
      },
      {
        data: newFormatData.value.updated,
        borderColor: '#f7b602',
        fill: false,
        cubicInterpolationMode: 'monotone',
        label: t('stats.updated'),
      },
    ],
    labels: newFormatDates.value,
  }
})
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
}
</style>
