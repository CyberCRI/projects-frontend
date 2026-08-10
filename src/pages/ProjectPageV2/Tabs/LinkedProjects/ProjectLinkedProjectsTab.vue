<script setup lang="ts">
import BaseLinkedProjects from '@/components/project/modules/LinkedProjects/BaseLinkedProjects.vue'
import type { TranslatedProject } from 'shared-projects-frontend/models'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import { PROJECT_MODULE_TITLE } from '~/functs/constants'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    editable?: boolean
  }>(),
  { editable: false }
)

const countElement = computed<number>(() => props.project.modules?.linked_projects)
</script>

<template>
  <BaseModuleTab
    :title="$t(PROJECT_MODULE_TITLE.linked_projects, countElement)"
    :count="countElement"
  >
    <BaseLinkedProjects :project="project" :editable="editable" />
  </BaseModuleTab>
</template>
