<template>
  <BaseModuleTab :title="$t(PROJECT_MODULE_TITLE.reviews, countElement)" :count="countElement">
    <BaseProjectReviews :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseProjectReviews from '~/components/project/modules/review/BaseProjectReviews.vue'
import type { TranslatedProject } from 'shared-projects-frontend/models/project.model'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import { PROJECT_MODULE_TITLE } from '~/functs/constants'

const props = defineProps<{
  project: TranslatedProject
  editable?: boolean
}>()

const countElement = computed<number>(() => props.project.modules?.reviews)
</script>
