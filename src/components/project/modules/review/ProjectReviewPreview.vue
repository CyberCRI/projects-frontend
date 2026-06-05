<script setup lang="ts">
import BaseProjectReviews from '~/components/project/modules/review/BaseProjectReviews.vue'
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
      name: 'ProjectReviews',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseProjectReviews :project="project" preview :limit="3" />
    </template>
  </BaseModulePreview>
</template>
