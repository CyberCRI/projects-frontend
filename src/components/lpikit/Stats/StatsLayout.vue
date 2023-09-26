<template>
    <TabsLayout :tabs="tabs" :align-left="true" class="stats-tab narrow-body" />
</template>

<script>
import TabsLayout from '@/components/lpikit/Tabs/TabsLayout.vue'
import { defineAsyncComponent } from 'vue'

export default {
    name: 'StatsLayout',

    components: {
        TabsLayout,
    },

    data() {
        return {
            tabs: [
                {
                    key: 'stats-all',
                    label: this.$t('home.all-projects'),
                    component: defineAsyncComponent(() => import('./StatsByTab.vue')),
                    props: { filter: 'all' },
                },
                {
                    key: 'stats-public',
                    label: this.$t('project.public'),
                    component: defineAsyncComponent(() => import('./StatsByTab.vue')),
                    props: { filter: 'public' },
                },
                {
                    key: 'stats-private',
                    label: this.$t('project.private'),
                    component: defineAsyncComponent(() => import('./StatsByTab.vue')),
                    props: { filter: 'private' },
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
