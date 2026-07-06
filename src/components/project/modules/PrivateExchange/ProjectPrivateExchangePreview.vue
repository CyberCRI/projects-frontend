<script setup lang="ts">
import BaseProjectComments from '@/components/project/modules/Comments/BaseProjectComments.vue'
import { PROJECT_MODULE_ICON, PROJECT_MODULE_TITLE } from '~/functs/constants'
import type { TranslatedProject } from 'shared-projects-frontend'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(PROJECT_MODULE_TITLE.messages)"
    :icon="PROJECT_MODULE_ICON.messages"
    :total="project.modules.messages"
    :see-more="{
      name: 'projectPrivateExchange',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseProjectComments :project="project" preview is-private :limit="3" />
    </template>
  </BaseModulePreview>
</template>
