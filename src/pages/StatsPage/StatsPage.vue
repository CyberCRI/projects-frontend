<template>
    <div class="page-section-wide page-top">
        <h1 class="page-title">{{ $t('stats.page-title') }}</h1>
        <TabsLayout :tabs="tabs" :align-left="true" class="stats-tab" />
    </div>
</template>

<script>
import TabsLayout from '@/components/base/navigation/TabsLayout.vue'
import { defineAsyncComponent } from 'vue'

export default {
    name: 'StatsPage',

    components: {
        TabsLayout,
    },

    data() {
        return {
            tabs: [
                {
                    key: 'stats-all',
                    label: this.$t('home.all-projects'),
                    component: defineAsyncComponent(() => import('./Tabs/StatsByTab.vue')),
                    props: { filter: 'all' },
                },
                {
                    key: 'stats-public',
                    label: this.$t('project.public'),
                    component: defineAsyncComponent(() => import('./Tabs/StatsByTab.vue')),
                    props: { filter: 'public' },
                },
                {
                    key: 'stats-private',
                    label: this.$t('project.private'),
                    component: defineAsyncComponent(() => import('./Tabs/StatsByTab.vue')),
                    props: { filter: 'private' },
                },
                {
                    key: 'stats-community',
                    label: this.$t('project.community'),
                    component: defineAsyncComponent(() => import('./Tabs/StatsByTab.vue')),
                    props: { filter: 'org' },
                },
            ],
        }
    },
}
</script>

<style lang="scss" scoped>
.stats-tab {
    margin-top: 70px;
}
</style>
