<template>
  <BaseModuleTab :title="$t(ProjectModuleTitle.members, countElement)" :count="countElement">
    <BaseProjectMembersList :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import BaseProjectMembersList from '@/components/project/modules/Members/BaseProjectMembersList.vue'
import { ProjectModuleTitle, TranslatedProject } from '@/models/project.model'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    editable?: boolean
  }>(),
  { editable: false }
)

const countElement = computed<number>(() => props.project.modules?.members)
</script>
