<script setup lang="ts">
import BaseGoalList from '~/components/project/modules/Goals/BaseGoalList.vue'
import { ProjectModuleIcon, ProjectModuleTitle } from '@/models/project.model'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedProject } from '@/models/project.model'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(ProjectModuleTitle.goals)"
    :icon="ProjectModuleIcon.goals"
    :total="project.modules.goals"
    :see-more="{
      name: 'projectGoals',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseGoalList :project="project" preview />
    </template>
  </BaseModulePreview>
</template>
