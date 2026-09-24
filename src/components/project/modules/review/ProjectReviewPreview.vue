<script setup lang="ts">
import type { TranslatedProject, TranslatedProjectTab } from 'shared-projects-frontend/models'
import BaseProjectReviews from '~/components/project/modules/review/BaseProjectReviews.vue'

defineProps<{ project: TranslatedProject; tab: TranslatedProjectTab }>()
</script>

<template>
  <BaseModulePreview
    :title="tab.$t.title"
    :icon="tab.icon"
    :total="tab.modules.items"
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
