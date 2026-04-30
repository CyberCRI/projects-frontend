<script setup lang="ts">
import BaseProjectComments from '@/components/project/modules/Comments/BaseProjectComments.vue'
import { ProjectModuleIcon, ProjectModuleTitle } from '@/models/project.model'
import type { TranslatedProject } from '@/models/project.model'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(ProjectModuleTitle.comments)"
    :icon="ProjectModuleIcon.comments"
    :total="project.modules.comments"
    :see-more="{
      name: 'projectComments',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseProjectComments :project="project" preview :limit="3" />
    </template>
  </BaseModulePreview>
</template>
