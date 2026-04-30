<template>
  <BaseRecommendationList
    :recomendations="projects"
    :more-label="$t('recommendations.more-projects')"
    :to="{
      name: 'ProjectRecommendationPage',
    }"
  >
    <ProjectRecommendationItem v-for="project in projects" :key="project.id" :project="project" />
  </BaseRecommendationList>
</template>

<script setup lang="ts">
import ProjectRecommendationItem from '@/components/search/Recommendations/ProjectRecommendationItem.vue'
import BaseRecommendationList from '@/components/search/Recommendations/BaseRecommendationList.vue'
import type { TranslatedProject } from '@/models/project.model'

defineProps<{
  projects: TranslatedProject[]
}>()
</script>
