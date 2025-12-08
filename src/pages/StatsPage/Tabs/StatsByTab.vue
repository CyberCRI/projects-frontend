<template>
  <div class="stats-by-tab">
    <StatCard :title="$t('stats.number-projects-total')">
      <LpiLoader v-if="isLoading" type="simple" />
      <TotalChart v-else :stats="stats.total" />
    </StatCard>

    <StatCard :title="$t('stats.number-projects-sdg')">
      <LpiLoader v-if="isLoading" type="simple" />
      <SdgChart v-else :stats="stats.by_sdg" />
    </StatCard>

    <StatCard :title="$t('stats.time-evolution')">
      <LpiLoader v-if="isLoading" type="simple" />
      <TimeOrgChart v-else :stats="stats.by_month" />
    </StatCard>

    <StatCard :title="$t('stats.number-tags')">
      <LpiLoader v-if="isLoading" type="simple" />
      <TagChart v-else :stats="stats.top_tags" />
    </StatCard>
  </div>
</template>

<script>
import StatCard from '@/components/stats/StatCard.vue'
import SdgChart from '@/components/stats/Charts/SdgChart.vue'
import TagChart from '@/components/stats/Charts/TagChart.vue'
import LpiLoader from '@/components/base/loader/LoaderSimple.vue'
import TimeOrgChart from '@/components/stats/Charts/TimeOrgChart.vue'
import { getStats } from '@/api/stats.service'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import TotalChart from '@/components/stats/Charts/TotalChart.vue'

export default {
  name: 'StatsByTab',

  components: {
    StatCard,
    LpiLoader,
    SdgChart,
    TagChart,
    TimeOrgChart,
    TotalChart,
  },
  props: {
    filter: {
      type: String,
      default: '',
    },
  },
  setup() {
    const organizationsStore = useOrganizationsStore()
    return {
      organizationsStore,
    }
  },

  data() {
    return {
      isLoading: true,
      renderCount: 0,
      stats: undefined,
    }
  },
  computed: {
    organization() {
      return this.organizationsStore.current
    },
  },

  async created() {
    this.stats = await getStats(this.filter, this.organization.code)
    this.isLoading = false
  },
}
</script>

<style lang="scss" scoped>
.stats-by-tab {
  padding: $space-xl $space-l;
  display: flex;
  flex-wrap: wrap;
  gap: $space-m;
}

:deep(.stat-card) {
  flex: 1 1 calc(50% - $space-m);

  .loader-simple {
    margin: auto;
  }
}

@media screen and (max-width: $max-tablet) {
  .stats-by-tab {
    padding: $space-l $space-s;
  }

  :deep(.stat-card) {
    flex-basis: 100%;
    max-width: 100%;
  }
}
</style>
