<script setup lang="ts">
import BaseProjectReview from '@/components/project/review/BaseProjectReview.vue'
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
      // TODO
      name: 'projectResources',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseProjectReview :project="project" />
    </template>
  </BaseModulePreview>
</template>
