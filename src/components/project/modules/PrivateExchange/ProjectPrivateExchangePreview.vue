<script setup lang="ts">
import BaseProjectComments from '@/components/project/modules/Comments/BaseProjectComments.vue'
import { ProjectModuleIcon, ProjectModuleTitle } from '@/models/project.model'
import type { TranslatedProject } from '@/models/project.model'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(ProjectModuleTitle.messages)"
    :icon="ProjectModuleIcon.messages"
    :total="project.modules.messages"
    :see-more="{
      name: 'projectPrivateExchange',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseProjectComments :project="project" preview is-private />
    </template>
  </BaseModulePreview>
</template>
