<script setup lang="ts">
import BaseProjectComments from '~/components/project/modules/Comments/BaseProjectComments.vue'
import { ProjectModuleIcon, ProjectModuleTitle } from '@/models/project.model'
import type { TranslatedProject } from '@/models/project.model'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(ProjectModuleTitle.reviews)"
    :icon="ProjectModuleIcon.reviews"
    :total="project.modules.reviews"
    :see-more="{
      name: 'projectPrivateExchange',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseProjectComments :project="project" is-private />
    </template>
  </BaseModulePreview>
</template>
