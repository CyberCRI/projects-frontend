<script setup lang="ts">
import BaseLinkedProjects from '@/components/project/modules/LinkedProjects/BaseLinkedProjects.vue'
import { ProjectModuleIcon, ProjectModuleTitle } from '@/models/project.model'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedProject } from '@/models/project.model'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(ProjectModuleTitle.linked_projects)"
    :icon="ProjectModuleIcon.linked_projects"
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
