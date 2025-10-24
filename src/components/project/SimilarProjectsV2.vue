<template>
  <div class="similar-projects">
    <h3 class="group-section-title">
      {{ capitalize($t('project.suggested', 2)) }}
    </h3>
    <p class="hint">{{ $t('project.suggested-hint') }}</p>

    <SimilarProjectsItem
      v-for="project in similarProjectsDisplayed"
      :key="project.id"
      class="similar-project"
      :project="project"
    />
  </div>
</template>

<script>
import { capitalize } from '@/functs/string'

export default {
  name: 'SimilarProjectsV2',

  props: {
    similarProjects: {
      type: Array,
      default: () => [],
    },
  },

  setup() {
    const { isMobile, isTablet } = useViewportWidth()
    return {
      isMobile,
      isTablet,
      capitalize,
    }
  },

  computed: {
    similarProjectsDisplayed() {
      // if (this.allProjectsVisible) return this.similarProjects
      // else {
      //   if (this.isMobile) return this.similarProjects.slice(0, 1)
      //   else if (this.isTablet) return this.similarProjects.slice(0, 2)
      return this.similarProjects.slice(0, 4)
      // }
    },
  },
}
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
