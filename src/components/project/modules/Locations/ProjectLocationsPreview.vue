<script setup lang="ts">
import ProjectLocationBase from '@/components/project/modules/Locations/ProjectLocationBase.vue'
import { ProjectModuleIcon, ProjectModuleTitle } from '@/models/project.model'
import type { TranslatedProject } from '@/models/project.model'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(ProjectModuleTitle.locations)"
    :icon="ProjectModuleIcon.locations"
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
