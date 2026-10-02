<script setup lang="ts">
import BaseProjectComments from '@/components/project/modules/Comments/BaseProjectComments.vue'
import type { TranslatedProject, TranslatedProjectTab } from 'shared-projects-frontend/models'

defineProps<{ project: TranslatedProject; tab: TranslatedProjectTab }>()
</script>

<template>
  <BaseModulePreview
    :title="tab.$t.title"
    :icon="tab.icon"
    :total="tab.modules.items"
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
