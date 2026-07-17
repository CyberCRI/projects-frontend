<template>
  <li class="recommendation-item">
    <NuxtLink
      class="recommendation"
      :to="{
        name: 'ProjectSnapshot',
        params: { slugOrId: project.slug },
      }"
    >
      <CroppedApiImage
        ref="projectImg"
        :alt="`${project.$t.title} image`"
        class="img-container skeletons-background"
        :picture-data="project.header_image"
        picture-size="small"
        :default-picture="DEFAULT_PROJECT_PATATOID"
      />
      <div class="text-container">
        <span class="project-title skeletons-text">
          {{ project.$t.title }}
        </span>
        <span v-if="project.isFeatured" class="is-featured skeletons-text">
          {{ $t('recommendations.is-featured') }}
        </span>
      </div>
    </NuxtLink>
  </li>
</template>

<script setup lang="ts" generic="">
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import type { TranslatedProject } from 'shared-projects-frontend/models'
import { DEFAULT_PROJECT_PATATOID } from '@/composables/usePatatoids'

type TranslatedProjectRecomended = TranslatedProject & {
  isFeatured?: boolean
}

defineProps<{
  project: TranslatedProjectRecomended
}>()
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.recommendation-item {
  padding-inline: variables.$space-m;
  cursor: pointer;

  &:hover {
    background: variables.$primary-lighter;
  }
}

.recommendation {
  margin: variables.$space-m 0;
  display: flex;
  align-items: center;
  padding: variables.$space-s;

  &--spacer {
    padding: variables.$space-s 16px;
  }
}

.img-container {
  border-radius: variables.$border-radius-s;
  background-size: cover;
  background-position: top center;
  width: 50px;
  height: 50px;
  flex: none;
  margin-right: variables.$space-s;
}

.text-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.project-title {
  font-weight: 700;
  font-size: variables.$font-size-m;
  color: variables.$primary-dark;
  line-height: variables.$line-height-tight;
}

.is-featured {
  font-size: variables.$font-size-s;
  color: variables.$primary-dark;
}
</style>
