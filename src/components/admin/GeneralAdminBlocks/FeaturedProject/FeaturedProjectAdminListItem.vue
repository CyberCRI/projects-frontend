<template>
  <NuxtLink
    class="featured-project-admin-list-item"
    :to="{
      name: 'pageProject',
      params: { slugOrId: project.slug || project.id },
    }"
  >
    <div class="project-image">
      <CroppedApiImage
        :alt="`${project.title} image`"
        :picture-data="project.header_image"
        picture-size="small"
        :default-picture="DEFAULT_PROJECT_PATATOID"
        class="picture"
      />
    </div>
    <div project-text>
      <h4 class="title">
        {{ project.$t.title }}
      </h4>
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

.featured-project-admin-list-item {
  display: flex;
  gap: variables.$space-unit;
  justify-content: flex-start;
  align-items: flex-start;

  &:hover {
    background-color: variables.$primary-lighter;
  }

  .project-image {
    display: flex;
    width: 4rem;
    height: 4rem;
    overflow: hidden;
  }

  .picture {
    flex-grow: 1;
  }

  .title {
    color: variables.$primary-dark;
    font-weight: 700;
    text-overflow: ellipsis;

    /* Required for text-overflow to do anything */
    white-space: nowrap;
    overflow: hidden;
    max-width: 32rem;

    @media screen and (max-width: variables.$min-tablet) {
      max-width: 15rem;
    }
  }

  & + .featured-project-admin-list-item {
    margin-top: variables.$space-unit;
  }
}
</style>
