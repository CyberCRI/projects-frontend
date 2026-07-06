<template>
  <BaseModuleTab :title="$t(PROJECT_MODULE_TITLE.messages, countElement)" :count="countElement">
    <BaseProjectComments :project="project" :editable="editable" is-private :preview="preview" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseProjectComments from '@/components/project/modules/Comments/BaseProjectComments.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import type { TranslatedProject } from 'shared-projects-frontend'
import { PROJECT_MODULE_TITLE } from '~/functs/constants'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    editable?: boolean
    preview?: boolean
  }>(),
  { editable: false, preview: false }
)

const countElement = computed<number>(() => props.project.modules?.messages)
</script>
