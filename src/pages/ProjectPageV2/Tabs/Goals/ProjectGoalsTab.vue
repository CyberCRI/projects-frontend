<template>
  <BaseModuleTab :title="$t(ProjectModuleTitle.goals, countElement)" :count="countElement">
    <BaseProjectGoalList :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseProjectGoalList from '~/components/project/modules/Goals/BaseProjectGoalList.vue'
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

const countElement = computed<number>(() => props.project.modules?.goals)
</script>
