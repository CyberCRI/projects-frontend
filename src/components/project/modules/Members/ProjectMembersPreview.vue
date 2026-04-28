<script setup lang="ts">
import BaseProjectMembersList from '@/components/project/modules/Members/BaseProjectMembersList.vue'
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
      <BaseProjectMembersList :project="project" />
    </template>
  </BaseModulePreview>
</template>
