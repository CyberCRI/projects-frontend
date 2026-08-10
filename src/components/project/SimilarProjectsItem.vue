<template>
  <NuxtLink
    class="similar-project"
    :to="{
      name: 'ProjectSnapshot',
      params: {
        slugOrId: project.slug,
      },
    }"
  >
    <CroppedApiImage
      v-if="project.header_image"
      :alt="`${project.$t.title} image`"
      :picture-data="project.header_image"
      picture-size="small"
      class="skeletons-background"
      :default-picture="DEFAULT_PROJECT_PATATOID"
    />

    <p class="skeletons-text">{{ project.$t.title }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { TranslatedProject } from 'shared-projects-frontend/models'

import CroppedApiImage from '~/components/base/media/CroppedApiImage.vue'

import { DEFAULT_PROJECT_PATATOID } from '~/composables/usePatatoids'

defineProps<{
  project: TranslatedProject
}>()
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.similar-project {
  display: flex;
  align-items: center;
  cursor: pointer;

  .cropped-image {
    margin-right: variables.$space-s;
    flex: 0 0 72px;
    height: 72px;
    border-radius: variables.$border-radius-xs;
  }

  p {
    color: var(--similar-project-text-color, variables.$white);
    font-size: variables.$font-size-s;
    font-weight: 400;
  }
}
</style>
