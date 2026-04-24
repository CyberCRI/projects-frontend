<script setup lang="ts">
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import BaseProjectReview from '@/components/project/review/BaseProjectReview.vue'
import { ProjectModuleIcon, ProjectModuleTitle, TranslatedProject } from '@/models/project.model'

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
      params: { slugOrid: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseProjectReview :project="project" />
    </template>
  </BaseModulePreview>
</template>
