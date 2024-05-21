<template>
    <BaseListSummaryBlock
        :title="
            projects.length > 2 ? $t(`home.short-title.projects`) : $t(`home.long-title.projects`)
        "
        :items="projects"
        :inlined="inlined"
    >
        <template #default>
            <ProjectLine v-for="project in projects" :key="project.id" :project="project" />
        </template>

        <template #action>
            <SummaryAction
                v-if="projects.length > 2"
                :to="{ name: 'ProfileProjects' }"
                action-icon="ArrowRight"
                :action-label="$t('feed.see-all')"
            />
            <SummaryAction
                v-else-if="projects.length"
                :to="{ name: 'createProject' }"
                action-icon="ArrowRight"
                :action-label="$t('home.create-project')"
            />
            <SummaryAction
                v-else
                :to="{ name: 'createProject' }"
                action-icon="Plus"
                :action-label="$t('home.create-project')"
            />
        </template>
    </BaseListSummaryBlock>
</template>

<script>
import ProjectLine from '@/components/home/SummaryCards/ProjectLine.vue'
import BaseListSummaryBlock from '@/components/home/SummaryCards/BaseListSummaryBlock.vue'
import SummaryAction from '@/components/home/SummaryCards/SummaryAction.vue'

export default {
    name: 'ProjectSummaryBlock',

    components: { ProjectLine, BaseListSummaryBlock, SummaryAction },

    props: {
        projects: {
            type: Array,
            default: () => [],
        },
        inlined: {
            type: Boolean,
            default: false,
        },
    },
}
</script>
