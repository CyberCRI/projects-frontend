<script setup lang="ts">
import type { TranslatedProject, TranslatedProjectTab } from 'shared-projects-frontend/models'
import BaseProjectGoalList from '~/components/project/modules/Goals/BaseProjectGoalList.vue'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'

defineProps<{ project: TranslatedProject; tab: TranslatedProjectTab }>()
</script>

<template>
  <BaseModulePreview
    :title="tab.$t.title"
    :icon="tab.icon"
    :total="tab.modules.items"
    :see-more="{
      name: 'projectGoals',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <BaseProjectGoalList :project="project" preview :limit="50" />
    </template>
  </BaseModulePreview>
</template>
