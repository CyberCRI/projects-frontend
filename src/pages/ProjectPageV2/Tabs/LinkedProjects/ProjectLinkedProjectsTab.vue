<template>
  <BaseModuleTab
    :title="$t(ProjectModuleTitle.linked_projects, countElement)"
    :count="countElement"
  >
    <BaseLinkedProjects :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import BaseLinkedProjects from '@/components/project/modules/LinkedProjects/BaseLinkedProjects.vue'
import { ProjectModuleTitle, TranslatedProject } from '@/models/project.model'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    editable?: boolean
  }>(),
  { editable: false }
)

const countElement = computed<number>(() => props.project.modules?.linked_projects)
</script>
