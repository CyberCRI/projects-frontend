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
import { DEFAULT_PROJECT_PATATOID } from '@/composables/usePatatoids'
import { TranslatedProject } from '@/models/project.model'

type TranslatedProjectRecomended = TranslatedProject & {
  isFeatured?: boolean
}

defineProps<{
  project: TranslatedProjectRecomended
}>()
</script>

<style lang="scss" scoped>
.recommendation-item {
  padding-inline: $space-m;
  cursor: pointer;

  &:hover {
    background: $primary-lighter;
  }
}

.recommendation {
  margin: $space-m 0;
  display: flex;
  align-items: center;
  padding: $space-s;

  &--spacer {
    padding: $space-s 16px;
  }
}

.img-container {
  border-radius: $border-radius-s;
  background-size: cover;
  background-position: top center;
  width: 50px;
  height: 50px;
  flex: none;
  margin-right: $space-s;
}

.text-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.project-title {
  font-weight: 700;
  font-size: $font-size-m;
  color: $primary-dark;
  line-height: $line-height-tight;
}

.is-featured {
  font-size: $font-size-s;
  color: $primary-dark;
}
</style>
