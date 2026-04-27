<template>
  <BaseModuleTab :title="$t(ProjectModuleTitle.blogs, countElement)" :count="countElement">
    <BaseBlogEntryList :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import BaseBlogEntryList from '@/components/project/modules/BlogEntries/BaseBlogEntryList.vue'
import { ProjectModuleTitle, TranslatedProject } from '@/models/project.model'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    editable?: boolean
  }>(),
  { editable: false }
)

const countElement = computed<number>(() => props.project.modules?.blogs)
</script>
