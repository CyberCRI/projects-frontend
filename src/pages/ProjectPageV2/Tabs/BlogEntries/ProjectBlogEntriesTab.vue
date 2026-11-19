<template>
  <BaseModuleTab :title="tab.$t.title" :count="countElement">
    <BaseBlogEntryList :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseBlogEntryList from '@/components/project/modules/BlogEntries/BaseBlogEntryList.vue'
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
