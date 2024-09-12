<template>
    <div class="project-tabs project-tabs-skeleton">
        <TabsLayout :border="false" :tabs="projectTabs" />
    </div>
</template>

<script>
import TabsLayout from '@/components/base/navigation/TabsLayout.vue'
import { shallowRef, defineAsyncComponent } from 'vue'

export default {
    name: 'ProjectTabsSkeleton',

    components: { TabsLayout },

    data() {
        return {
            projectTabs: [
                {
                    key: 'project-summary',
                    label: this.$t('project.summary'),
                    component: shallowRef(
                        defineAsyncComponent(
                            () => import('@/components/project/TabContentSkeleton.vue')
                        )
                    ),
                },
                {
                    key: 'project-description',
                    label: this.$t('form.description'),
                    component: shallowRef(
                        defineAsyncComponent(
                            () => import('@/components/project/TabContentSkeleton.vue')
                        )
                    ),
                },
                {
                    key: 'project-goals',
                    label: this.$t('goal.goals'),
                    component: shallowRef(
                        defineAsyncComponent(
                            () => import('@/components/project/TabContentSkeleton.vue')
                        )
                    ),
                },
                {
                    key: 'project-team',
                    label: this.$t('team.team'),
                    component: shallowRef(
                        defineAsyncComponent(
                            () => import('@/components/project/TabContentSkeleton.vue')
                        )
                    ),
                },
                {
                    key: 'project-comments',
                    label: this.$t('comment.comments'),
                    component: shallowRef(
                        defineAsyncComponent(
                            () => import('@/components/project/TabContentSkeleton.vue')
                        )
                    ),
                },
            ],
        }
    },
}
</script>
