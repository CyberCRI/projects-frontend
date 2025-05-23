<template>
  <div class="similar-projects">
    <div class="group-section-title">
      {{ $filters.capitalize($t('project.suggested', 2)) }}
      <span class="hint">{{ $t('project.suggested-hint') }}</span>
    </div>

    <div class="similar-projects-ctn">
      <div :class="{ 'all-projects-visible': allProjectsVisible }" class="similar-projects-grid">
        <SimilarProjectsItem
          v-for="project in similarProjectsDisplayed"
          :key="project.id"
          class="similar-project"
          :project="project"
        />
      </div>

      <LpiButton
        v-if="seeMoreButtonVisible"
        :label="
          $filters.capitalize(allProjectsVisible ? $t('common.see-less') : $t('common.see-more'))
        "
        :btn-icon="allProjectsVisible ? 'ArrowLeft' : 'ArrowRight'"
        :reversed-order="true"
        class="see-more-btn"
        @click="toggleAllVisible"
      />
    </div>
  </div>
</template>

<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import SimilarProjectsItem from '@/components/project/SimilarProjectsItem.vue'

export default {
  name: 'SimilarProjects',

  components: { LpiButton, SimilarProjectsItem },

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
    }
  },

  data() {
    return {
      allProjectsVisible: false,
    }
  },

  computed: {
    seeMoreButtonVisible() {
      if (this.isMobile) return this.similarProjects.length > 1
      else if (this.isTablet) return this.similarProjects.length > 2
      return this.similarProjects.length > 4
    },

    similarProjectsDisplayed() {
      if (this.allProjectsVisible) return this.similarProjects
      else {
        if (this.isMobile) return this.similarProjects.slice(0, 1)
        else if (this.isTablet) return this.similarProjects.slice(0, 2)
        return this.similarProjects.slice(0, 4)
      }
    },
  },

  methods: {
    toggleAllVisible() {
      this.allProjectsVisible = !this.allProjectsVisible
    },
  },
}
</script>

<style lang="scss" scoped>
.similar-projects {
  .group-section-title {
    font-size: $font-size-2xl;
    font-weight: 700;
    margin-bottom: $space-l;

    .hint {
      font-size: $font-size-m;
      font-weight: 400;
      margin-left: $space-m;
    }

    @media screen and (max-width: $min-desktop) {
      .hint {
        display: block;
        margin-left: 0;
        margin-top: $space-m;
      }
    }
  }

  .similar-projects-ctn {
    background: $primary-dark;
    border-radius: $border-radius-l;
    padding: $space-l;

    .similar-projects-grid {
      display: flex;
      justify-content: space-around;
      gap: $space-m;
      max-width: 100%;
      overflow: hidden;

      &.all-projects-visible {
        justify-content: flex-start;

        .similar-project {
          min-width: 200px;
        }
      }
    }

    :deep(.see-more-btn) {
      color: $primary-dark;
      background: $white;

      svg {
        width: 24px;
        height: 24px;
        fill: $primary-dark;
      }
    }

    @media screen and (max-width: $min-tablet) {
      display: flex;
      flex-direction: column;
      align-items: center;

      .see-more-btn {
        margin-top: $space-m;
      }
    }
  }
}

@media screen and (min-width: $min-tablet) {
  .similar-projects .similar-projects-ctn {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;

    .similar-projects-grid {
      flex-grow: 1;

      > * {
        width: calc(25% - $space-m);
      }
    }

    .see-more-btn {
      margin-top: $space-m;
    }
  }
}
</style>
