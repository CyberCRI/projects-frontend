<template>
    <div class="stats-by-tab">
        <StatCard :title="$t('stats.number-projects-org')">
            <LpiLoader v-if="isLoading" />
            <ProjectsByOrg v-else :key="renderCount" :stats="stats.by_organization" />
        </StatCard>

        <StatCard :title="$t('stats.number-projects-sdg')">
            <LpiLoader v-if="isLoading" />
            <SdgChart v-else :key="renderCount" :stats="stats.by_sdg" />
        </StatCard>

        <StatCard :title="$t('stats.time-evolution')">
            <LpiLoader v-if="isLoading" />
            <TimeOrgChart v-else :key="renderCount" :stats="stats.by_month" />
        </StatCard>

        <StatCard :title="$t('stats.number-tags')">
            <LpiLoader v-if="isLoading" />
            <TagChart v-else :key="renderCount" :stats="stats.top_tags" />
        </StatCard>
    </div>
</template>

<script>
import StatCard from '@/components/lpikit/Stats/StatCard.vue'
import ProjectsByOrg from '@/components/lpikit/Stats/Charts/ProjectsByOrg.vue'
import SdgChart from '@/components/lpikit/Stats/Charts/SdgChart.vue'
import TagChart from '@/components/lpikit/Stats/Charts/TagChart.vue'
import LpiLoader from '@/components/base/loader/LoaderSimple.vue'
import TimeOrgChart from '@/components/lpikit/Stats/Charts/TimeOrgChart.vue'
import { getStats } from '@/api/stats.service'
import debounce from 'lodash.debounce'

export default {
    name: 'StatsByTab',

    components: {
        StatCard,
        ProjectsByOrg,
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
        this.stats = await getStats(this.filter)
        this.isLoading = false
    },

    mounted() {
        window.addEventListener(
            'resize',
            debounce(() => {
                this.renderCount++ // force re-render for responsive dataviz
            }),
            500
        )
    },

    data() {
        return {
            isLoading: true,
            renderCount: 0,
            stats: undefined,
        }
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
