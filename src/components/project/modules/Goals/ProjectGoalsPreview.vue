<script setup lang="ts">
import { ProjectModuleIcon, ProjectModuleTitle } from '@/models/project.model'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import GoalsRecap from '@/components/project/goal/GoalsRecap.vue'
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
      <GoalsRecap :project="project" preview />
    </template>
  </BaseModulePreview>
</template>
