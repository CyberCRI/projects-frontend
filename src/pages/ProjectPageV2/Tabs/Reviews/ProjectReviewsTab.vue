<template>
  <BaseModuleTab :title="tab.$t.title" :count="countElement">
    <BaseProjectReviews :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import type { TranslatedProject, TranslatedProjectTab } from 'shared-projects-frontend/models'
import BaseProjectReviews from '~/components/project/modules/review/BaseProjectReviews.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'

const props = defineProps<{
  project: TranslatedProject
  tab: TranslatedProjectTab
  editable?: boolean
}>()

const countElement = computed<number>(() => props.tab.modules.items)
</script>
