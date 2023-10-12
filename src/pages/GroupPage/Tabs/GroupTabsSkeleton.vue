<template>
    <div class="group-tabs">
        <TabsLayout :border="false" :tabs="groupTabs" />
    </div>
</template>

<script>
import TabsLayout from '@/components/lpikit/Tabs/TabsLayout.vue'
import { shallowRef, defineAsyncComponent } from 'vue'
export default {
    name: 'GroupTabsSkeleton',
    components: { TabsLayout },
    data() {
        return {
            groupTabs: [
                {
                    key: 'snapshot',
                    label: this.$t('group.snapshot'),
                    component: shallowRef(
                        defineAsyncComponent(() => import('./SnapshotSkeleton.vue'))
                    ),
                },
                {
                    key: 'members',
                    label: this.$t('group.members'),
                    component: shallowRef(
                        defineAsyncComponent(() => import('./MembersSkeleton.vue'))
                    ),
                },
                {
                    key: 'projects',
                    label: this.$t('group.projects'),
                    component: shallowRef(
                        defineAsyncComponent(() => import('./ProjectsSkeleton.vue'))
                    ),
                },
            ],
        }
    },
}
</script>
