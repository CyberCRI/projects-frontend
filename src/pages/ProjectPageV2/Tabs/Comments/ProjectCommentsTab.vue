<template>
  <BaseModuleTab :title="tab.$t.title" :count="countElement">
    <BaseProjectComments :project="project" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseProjectComments from '@/components/project/modules/Comments/BaseProjectComments.vue'
import type { TranslatedProject, TranslatedProjectTab } from 'shared-projects-frontend/models'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'

const props = defineProps<{
  project: TranslatedProject
  tab: TranslatedProjectTab
}>()

const countElement = computed<number>(() => props.tab.modules.items)
</script>
