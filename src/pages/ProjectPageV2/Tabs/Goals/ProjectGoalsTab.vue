<template>
  <BaseModuleTab :title="tab.$t.title" :count="countElement">
    <BaseProjectGoalList :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import type { TranslatedProject, TranslatedProjectTab } from 'shared-projects-frontend/models'
import BaseProjectGoalList from '~/components/project/modules/Goals/BaseProjectGoalList.vue'
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
