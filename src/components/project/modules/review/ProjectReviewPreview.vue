<script setup lang="ts">
import BaseProjectReviews from '~/components/project/modules/review/BaseProjectReviews.vue'
import { PROJECT_MODULE_ICON, PROJECT_MODULE_TITLE } from '~/functs/constants'
import type { TranslatedProject } from 'shared-projects-frontend'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(PROJECT_MODULE_TITLE.reviews)"
    :icon="PROJECT_MODULE_ICON.reviews"
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
