<template>
  <BaseModuleTab :title="$t(ProjectModuleTitle.announcements, countElement)" :count="countElement">
    <BaseProjectAnnouncements :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseProjectAnnouncements from '@/components/project/modules/Announcements/BaseProjectAnnouncements.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import type { TranslatedProject } from '@/models/project.model'
import { ProjectModuleTitle } from '@/models/project.model'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    editable?: boolean
  }>(),
  { editable: false }
)

const countElement = computed<number>(() => props.project.modules?.announcements)
</script>
