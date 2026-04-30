<template>
  <BaseModuleTab :title="$t(ProjectModuleTitle.comments, countElement)" :count="countElement">
    <BaseProjectComments :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseProjectComments from '@/components/project/modules/Comments/BaseProjectComments.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import type { TranslatedProject } from '@/models/project.model'
import { ProjectModuleTitle } from '@/models/project.model'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    editable?: boolean
  }>(),
  { editable: false }
)

const countElement = computed<number>(() => props.project.modules?.comments)
</script>
