<script setup lang="ts">
import ProjectLocationBase from '@/components/project/modules/Locations/ProjectLocationBase.vue'
import { PROJECT_MODULE_ICON, PROJECT_MODULE_TITLE } from '~/functs/constants'
import type { TranslatedProject } from 'shared-projects-frontend'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(PROJECT_MODULE_TITLE.locations)"
    :icon="PROJECT_MODULE_ICON.locations"
    :total="project.modules.locations"
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
