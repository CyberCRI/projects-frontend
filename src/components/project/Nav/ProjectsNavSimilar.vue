<template>
  <div class="similar-projects">
    <h3 class="group-section-title skeletons-text">
      {{ $t('project.suggested', projects.length) }}
    </h3>
    <p class="hint skeletons-text">{{ $t('project.suggested-hint') }}</p>

    <SimilarProjectsItem
      v-for="project in projectsSliced"
      :key="project.id"
      class="similar-project"
      :project="project"
    />
  </div>
</template>

<script setup lang="ts">
import type { TranslatedProject } from '~/models/project.model'
import { isNil } from 'es-toolkit'

const props = withDefaults(
  defineProps<{
    projects?: TranslatedProject[]
    limit?: number
  }>(),
  {
    projects: () => [],
    limit: null,
  }
)

const projectsSliced = computed(() =>
  isNil(props.limit) ? props.projects : props.projects.slice(0, props.limit)
)
</script>

<style lang="scss" scoped>
.similar-projects {
  border: 1px solid var(--lighter-gray);
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
    --similar-project-text-color: var(--primary-dark);

    &:hover {
      background-color: var(--primary-light);
    }
  }
}
</style>
