<script setup lang="ts">
import BaseProjectGoalList from '~/components/project/modules/Goals/BaseProjectGoalList.vue'
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
      <BaseProjectGoalList :project="project" preview :limit="50" />
    </template>
  </BaseModulePreview>
</template>
