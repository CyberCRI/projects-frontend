<script setup lang="ts">
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import ProjectLocationBase from '@/components/project/modules/Locations/ProjectLocationBase.vue'
import { ProjectModuleIcon, ProjectModuleTitle, TranslatedProject } from '@/models/project.model'

defineProps<{ project: TranslatedProject }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(ProjectModuleTitle.locations)"
    :icon="ProjectModuleIcon.locations"
    :total="project.modules.locations"
    :see-more="{
      name: 'ProjectLocations',
      params: { slugOrid: project.slug || project.id },
    }"
  >
    <template #content>
      <ProjectLocationBase :project="project" preview />
    </template>
  </BaseModulePreview>
</template>
