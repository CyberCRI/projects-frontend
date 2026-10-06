<script setup lang="ts">
import ProjectLocationBase from '@/components/project/modules/Locations/ProjectLocationBase.vue'
import type { TranslatedProject, TranslatedProjectTab } from 'shared-projects-frontend/models'

defineProps<{ project: TranslatedProject; tab: TranslatedProjectTab }>()
</script>

<template>
  <BaseModulePreview
    :title="tab.$t.title"
    :icon="tab.icon"
    :total="tab.modules.items"
    :see-more="{
      name: 'ProjectLocations',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <template #content>
      <ProjectLocationBase :project="project" preview />
    </template>
  </BaseModulePreview>
</template>
