<template>
  <BaseListSummaryBlock
    :title="$t(`home.short-title.projects`)"
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

<script setup lang="ts">
import ProjectLine from '@/components/home/SummaryCards/ProjectLine.vue'
import BaseListSummaryBlock from '@/components/home/SummaryCards/BaseListSummaryBlock.vue'
import SummaryAction from '@/components/home/SummaryCards/SummaryAction.vue'
import { TranslatedProject } from '@/models/project.model'

withDefaults(
  defineProps<{
    projects?: TranslatedProject[]
    inlined?: boolean
  }>(),
  {
    projects: () => [],
    inlined: false,
  }
)
</script>
