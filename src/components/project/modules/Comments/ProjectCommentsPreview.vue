<script setup lang="ts">
import BaseProjectComments from '@/components/project/modules/Comments/BaseProjectComments.vue'
import { PROJECT_MODULE_ICON, PROJECT_MODULE_TITLE } from '~/functs/constants'
import type { TranslatedProject } from 'shared-projects-frontend/models'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(PROJECT_MODULE_TITLE.comments)"
    :icon="PROJECT_MODULE_ICON.comments"
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
