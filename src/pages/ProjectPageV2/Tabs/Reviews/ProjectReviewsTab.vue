<template>
  <BaseModuleTab :title="$t(ProjectModuleTitle.reviews, countElement)" :count="countElement">
    <BaseProjectReviews :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseProjectReviews from '~/components/project/modules/review/BaseProjectReviews.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import type { TranslatedProject } from '@/models/project.model'
import { ProjectModuleTitle } from '@/models/project.model'

const props = defineProps<{
  project: TranslatedProject
  editable?: boolean
}>()

const countElement = computed<number>(() => props.project.modules?.reviews)
</script>
