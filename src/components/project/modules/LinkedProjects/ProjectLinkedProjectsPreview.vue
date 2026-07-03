<script setup lang="ts">
import BaseLinkedProjects from '@/components/project/modules/LinkedProjects/BaseLinkedProjects.vue'
import type { TranslatedProject } from 'shared-projects-frontend/models/project.model'
import { PROJECT_MODULE_ICON, PROJECT_MODULE_TITLE } from '~/functs/constants'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(PROJECT_MODULE_TITLE.linked_projects)"
    :icon="PROJECT_MODULE_ICON.linked_projects"
    :total="project.modules.linked_projects"
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
