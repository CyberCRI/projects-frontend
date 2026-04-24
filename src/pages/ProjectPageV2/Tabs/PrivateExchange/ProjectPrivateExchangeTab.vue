<template>
  <BaseModuleTab :title="$t(ProjectModuleTitle.messages, countElement)" :count="countElement">
    <BaseProjectComments :project="project" :editable="editable" is-private />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import BaseProjectComments from '@/components/project/modules/Comments/BaseProjectComments.vue'
import { ProjectModuleTitle, TranslatedProject } from '@/models/project.model'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    editable?: boolean
  }>(),
  { editable: false }
)

const countElement = computed<number>(() => props.project.modules?.messages)
</script>
