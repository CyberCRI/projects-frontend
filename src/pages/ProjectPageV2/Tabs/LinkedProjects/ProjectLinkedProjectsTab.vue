<script setup lang="ts">
import BaseLinkedProjects from '@/components/project/modules/LinkedProjects/BaseLinkedProjects.vue'
import type { TranslatedProject, TranslatedProjectTab } from 'shared-projects-frontend/models'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    tab: TranslatedProjectTab
    editable?: boolean
  }>(),
  { editable: false }
)

const countElement = computed<number>(() => props.tab.modules.items)
</script>

<template>
  <BaseModuleTab :title="tab.$t.title" :count="countElement">
    <BaseLinkedProjects :project="project" :editable="editable" />
  </BaseModuleTab>
</template>
