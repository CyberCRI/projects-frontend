<script setup lang="ts">
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import BaseProjectComments from '@/components/project/modules/Comments/BaseProjectComments.vue'
import { ProjectModuleIcon, ProjectModuleTitle, TranslatedProject } from '@/models/project.model'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(ProjectModuleTitle.messages)"
    :icon="ProjectModuleIcon.messages"
    :total="project.modules.messages"
    :see-more="{
      name: 'projectPrivateExchange',
      params: { slugOrid: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseProjectComments :project="project" preview is-private />
    </template>
  </BaseModulePreview>
</template>
