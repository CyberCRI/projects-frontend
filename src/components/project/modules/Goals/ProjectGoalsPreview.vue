<script setup lang="ts">
import BaseProjectGoalList from '~/components/project/modules/Goals/BaseProjectGoalList.vue'
import type { TranslatedProject } from 'shared-projects-frontend/models/project.model'
import { PROJECT_MODULE_ICON, PROJECT_MODULE_TITLE } from '~/functs/constants'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(PROJECT_MODULE_TITLE.goals)"
    :icon="PROJECT_MODULE_ICON.goals"
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
