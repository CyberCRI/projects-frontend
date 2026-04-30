<template>
  <div class="similar-projects">
    <h3 class="group-section-title">
      {{ t('project.suggested', similarProjects.length) }}
    </h3>
    <p class="hint">{{ t('project.suggested-hint') }}</p>

    <SimilarProjectsItem
      v-for="project in similarProjectsDisplayed"
      :key="project.id"
      class="similar-project"
      :project="project"
    />
  </div>
</template>

<script setup lang="ts">
import type { TranslatedProject } from '~/models/project.model'

const props = withDefaults(
  defineProps<{
    similarProjects?: TranslatedProject[]
  }>(),
  {
    similarProjects: () => [],
  }
)

const { t } = useNuxtI18n()

const similarProjectsDisplayed = computed(() => {
  return props.similarProjects.slice(0, 4)
})
</script>

<style lang="scss" scoped>
.similar-projects {
  border: 1px solid $lighter-gray;
  border-radius: 1rem;
  padding: 0.8rem;
  display: flex;
  flex-flow: column;
  gap: 0.5rem;

  .group-section-title {
    font-size: $font-size-m;
    font-weight: 700;
    margin-bottom: 0;
  }

  .hint {
    font-size: $font-size-s;
    font-weight: 400;
  }

  .similar-project {
    --similar-project-text-color: $primary-dark;

    &:hover {
      background-color: $primary-light;
    }
  }
}
</style>
