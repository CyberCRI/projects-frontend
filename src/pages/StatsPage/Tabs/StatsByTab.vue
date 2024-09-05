<template>
    <div class="stats-by-tab">
        <StatCard :title="$t('stats.number-projects-sdg')">
            <LpiLoader v-if="isLoading" />
            <SdgChart v-else :stats="stats.by_sdg" />
        </StatCard>

        <StatCard :title="$t('stats.time-evolution')">
            <LpiLoader v-if="isLoading" />
            <TimeOrgChart v-else :stats="stats.by_month" />
        </StatCard>

        <StatCard :title="$t('stats.number-tags')">
            <LpiLoader v-if="isLoading" />
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

export default {
    name: 'StatsByTab',

    components: {
        StatCard,
        LpiLoader,
        SdgChart,
        TagChart,
        TimeOrgChart,
    },

    props: {
        filter: {
            type: String,
            default: '',
        },
    },

    async created() {
        this.stats = await getStats(this.filter, this.organization.code)
        this.isLoading = false
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
            return this.$store.getters['organizations/current']
        },
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
