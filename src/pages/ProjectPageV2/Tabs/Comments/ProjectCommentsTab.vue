<template>
  <BaseModuleTab :title="$t(PROJECT_MODULE_TITLE.comments, countElement)" :count="countElement">
    <BaseProjectComments :project="project" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseProjectComments from '@/components/project/modules/Comments/BaseProjectComments.vue'
import type { TranslatedProject } from 'shared-projects-frontend/models/project.model'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import { PROJECT_MODULE_TITLE } from '~/functs/constants'

const props = defineProps<{
  project: TranslatedProject
}>()

const countElement = computed<number>(() => props.project.modules?.comments)
</script>
