<script setup lang="ts">
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import BaseProjectComments from '@/components/project/modules/Comments/BaseProjectComments.vue'
import { ProjectModuleIcon, ProjectModuleTitle, TranslatedProject } from '@/models/project.model'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(ProjectModuleTitle.private_exchange)"
    :icon="ProjectModuleIcon.private_exchange"
    :total="project.modules.private_exchange"
    :see-more="{
      name: 'projectPrivateExchange',
      params: { slugOrid: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseProjectComments :project="project" preview />
    </template>
  </BaseModulePreview>
</template>
