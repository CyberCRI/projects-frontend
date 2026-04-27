<script setup lang="ts">
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import BaseLinkedProjects from '@/components/project/modules/LinkedProjects/BaseLinkedProjects.vue'
import { ProjectModuleIcon, ProjectModuleTitle, TranslatedProject } from '@/models/project.model'

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
