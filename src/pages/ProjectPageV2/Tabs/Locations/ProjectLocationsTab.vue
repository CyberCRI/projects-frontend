<template>
  <BaseModuleTab :title="$t(ProjectModuleTitle.locations, countElement)" :count="countElement">
    <ProjectLocationBase :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import ProjectLocationBase from '@/components/project/modules/Locations/ProjectLocationBase.vue'
import { ProjectModuleTitle, TranslatedProject } from '@/models/project.model'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    editable?: boolean
  }>(),
  { editable: false }
)

const countElement = computed<number>(() => props.project.modules?.locations)
</script>
