<template>
  <NuxtLink
    :to="{
      name: 'pageProject',
      params: { slugOrId: project.slug || project.id },
    }"
    class="line"
  >
    <CroppedApiImage
      ref="projectImg"
      :alt="`${project?.$t?.title} image`"
      class="img-container"
      :picture-data="project?.header_image"
      picture-size="medium"
      :default-picture="DEFAULT_PROJECT_PATATOID"
    />
    <div class="project-title">
      {{ project?.$t?.title }}
    </div>
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

.line {
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: variables.$primary-lighter;
  }
}

.img-container {
  border-radius: variables.$border-radius-s !important;
  background-size: cover !important;
  background-position: top center !important;
  width: 50px !important;
  height: 50px !important;
  flex: none !important;
  margin-right: variables.$space-s !important;
}

.project-title {
  font-weight: 700;
  color: variables.$primary-dark;
  -webkit-line-clamp: 1;
  line-height: variables.$line-height-tight;
}
</style>
