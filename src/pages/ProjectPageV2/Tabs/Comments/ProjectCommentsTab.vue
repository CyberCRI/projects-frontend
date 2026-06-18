<template>
  <BaseModuleTab :title="$t(ProjectModuleTitle.comments, countElement)" :count="countElement">
    <BaseProjectComments :project="project" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseProjectComments from '@/components/project/modules/Comments/BaseProjectComments.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import type { TranslatedProject } from '@/models/project.model'
import { ProjectModuleTitle } from '@/models/project.model'

const props = defineProps<{
  project: TranslatedProject
}>()

const countElement = computed<number>(() => props.project.modules?.comments)
</script>
