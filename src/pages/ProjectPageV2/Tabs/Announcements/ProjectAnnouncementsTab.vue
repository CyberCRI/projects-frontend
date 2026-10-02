<template>
  <BaseModuleTab :title="tab.$t.title" :count="countElement">
    <BaseProjectAnnouncements :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseProjectAnnouncements from '@/components/project/modules/Announcements/BaseProjectAnnouncements.vue'
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
