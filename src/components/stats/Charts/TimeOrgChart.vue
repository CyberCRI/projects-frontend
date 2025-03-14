<template>
  <div class="container">
    <LpiLineChart :chart-data="formattedData" :options="options" />
  </div>
</template>

<script>
import { MONTH } from '@/functs/constants.ts'
import LpiLineChart from './Generic/LpiLineChart.vue'

export default {
  name: 'TimeOrgChart',

  components: { LpiLineChart },

  props: {
    stats: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      chartType: 'newProjects',
      startDate: new Date('2021', '12', '01'),
      endDate: new Date(),
      formattedData: undefined,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
          display: false,
        },
      },
    }
  },

  created() {
    const dates = this.getDates(this.startDate, this.endDate)
    const projectsData = this.newFormatData(this.stats, dates)
    const formatedDates = this.newFormatDates(dates)

    this.formattedData = {
      datasets: [
        {
          data: projectsData.created,
          borderColor: '#01910f',
          fill: false,
          cubicInterpolationMode: 'monotone',
          label: this.$t('stats.created'),
        },
        {
          data: projectsData.updated,
          borderColor: '#f7b602',
          fill: false,
          cubicInterpolationMode: 'monotone',
          label: this.$t('stats.updated'),
        },
      ],
      labels: formatedDates,
    }
  },

  methods: {
    getDates(startDate, endDate) {
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
    },

    newFormatDates(dates) {
      return dates.map((date) => `${MONTH[date.getMonth()]} ${date.getFullYear()}`)
    },

    newFormatData(stats, dates) {
      const statsDate = stats.map((stat) => new Date(stat.month))
      const data = { created: [], updated: [] }

      for (const date of dates) {
        const index = statsDate.findIndex(
          (statDate) => statDate.toLocaleDateString() === date.toLocaleDateString()
        )
        if (index !== -1) {
          data.created.push(stats[index].created_count)
          data.updated.push(stats[index].updated_count)
        } else {
          data.created.push(0)
          data.updated.push(0)
        }
      }
      return data
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
}
</style>
