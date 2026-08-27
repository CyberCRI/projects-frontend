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
        :to="{
          name: 'ProfileProjects',
          params: {
            userIdOrSlug: user.slug || user.id,
          },
        }"
        action-icon="ArrowRight"
        :action-label="$t('feed.see-all')"
      />
      <SummaryAction
        :to="{ name: 'createProject' }"
        :action-icon="projects.length ? 'ArrowRight' : 'Plus'"
        :action-label="$t('home.create-project')"
      />
    </template>
  </BaseListSummaryBlock>
</template>

<script setup lang="ts">
import type { TranslatedProject } from 'shared-projects-frontend/models'

import BaseListSummaryBlock from '~/components/home/SummaryCards/BaseListSummaryBlock.vue'
import SummaryAction from '~/components/home/SummaryCards/SummaryAction.vue'
import ProjectLine from '~/components/home/SummaryCards/ProjectLine.vue'
import useUsersStore from '~/stores/useUserStore'

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

const userStore = useUsersStore()

const user = computed(() => userStore.userFromApi)
</script>
