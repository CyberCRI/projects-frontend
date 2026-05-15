<script setup lang="ts">
import BaseProjectTeamsList from '@/components/project/modules/Teams/BaseProjectTeamsList.vue'
import { ProjectModuleIcon, ProjectModuleTitle } from '@/models/project.model'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedProject } from '@/models/project.model'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(ProjectModuleTitle.members)"
    :icon="ProjectModuleIcon.members"
    :total="project.modules.members"
    :see-more="{
      name: 'projectTeam',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseProjectTeamsList :project="project" preview :limit="5" />
    </template>
  </BaseModulePreview>
</template>
