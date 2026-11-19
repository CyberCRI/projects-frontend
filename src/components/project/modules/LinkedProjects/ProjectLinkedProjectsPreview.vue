<script setup lang="ts">
import BaseLinkedProjects from '@/components/project/modules/LinkedProjects/BaseLinkedProjects.vue'
import type { TranslatedProject, TranslatedProjectTab } from 'shared-projects-frontend/models'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'

defineProps<{ project: TranslatedProject; tab: TranslatedProjectTab }>()
</script>

<template>
  <BaseModulePreview
    :title="tab.$t.title"
    :icon="tab.icon"
    :total="tab.modules.items"
    :see-more="{
      name: 'projectLinkedProjects',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseLinkedProjects :project="project" preview />
    </template>
  </BaseModulePreview>
</template>
