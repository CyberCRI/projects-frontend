<template>
  <NuxtLink
    :to="{ name: 'pageProject', params: { slugOrId: project?.slug } }"
    class="home-project-item shadow-box"
  >
    <div class="project-img-container">
      <CroppedApiImage
        :alt="`${project?.title} image`"
        class="project-img skeletons-background"
        :ratio="1 / 1"
        :picture-data="project?.header_image"
        picture-size="medium"
        :default-picture="DEFAULT_PROJECT_PATATOID"
      />
    </div>
    <h3 class="project-title skeletons-text">
      {{ project?.$t?.title }}
    </h3>
    <div class="project-description">
      <p class="clamped skeletons-text">
        {{ purpose }}
      </p>
    </div>
    <SummaryAction class="project-action" :action-label="$t('common.read')" />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { TranslatedProject } from 'shared-projects-frontend/models'

import SummaryAction from '~/components/home/SummaryCards/SummaryAction.vue'
import CroppedApiImage from '~/components/base/media/CroppedApiImage.vue'

import { DEFAULT_PROJECT_PATATOID } from '~/composables/usePatatoids'

import { cropIfTooLong } from '~/functs/string'
import { html2Text } from '~/functs/tiptap'

defineOptions({ name: 'NewsfeedProjectItem' })

const props = withDefaults(
  defineProps<{
    project?: TranslatedProject
  }>(),
  { project: null }
)

const purpose = computed(() => {
  const sanitized = html2Text(props.project?.$t?.purpose || '')
  return cropIfTooLong(sanitized, 255)
})
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

$dimension: 120px;

.home-project-item {
  display: grid;
  border: variables.$border-width-s solid var(--lighter-gray);
  border-radius: variables.$border-radius-s;
  padding: variables.$space-l;
  min-height: $dimension;
  column-gap: variables.$space-l;
  grid-template-columns: $dimension auto;
  grid-template-rows: auto 1fr auto;

  @media screen and (max-width: variables.$min-tablet) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
    row-gap: variables.$space-l;
  }

  .project-img-container {
    height: $dimension;
    width: $dimension;
    grid-column: 1;
    grid-row: 1 / 4;
    aspect-ratio: 1;
    margin: 0 auto;

    @media screen and (max-width: variables.$min-tablet) {
      grid-column: 1;
      grid-row: 2;
      width: 200px; // see NewsfeedAnnouncementsItem.vue
      height: 200px;
    }

    .project-img {
      object-fit: cover;
      max-width: inherit;
      max-height: inherit;
      height: inherit;
      width: inherit;
      border-radius: variables.$border-radius-s;
      border: 1px solid var(--lighter-gray);
    }
  }
}

.project-title {
  display: block;
  font-size: variables.$font-size-l;
  line-height: variables.$line-height-tight;
  margin-bottom: variables.$space-s;
  grid-column: 2;
  grid-row: 1;

  @media screen and (max-width: variables.$min-tablet) {
    grid-column: 1;
    grid-row: 1;
  }
}

.project-description {
  grid-column: 2;
  grid-row: 2;

  @media screen and (max-width: variables.$min-tablet) {
    grid-column: 1;
    grid-row: 3;
  }
}

.clamped {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-action {
  grid-column: 2;
  grid-row: 3;

  @media screen and (max-width: variables.$min-tablet) {
    grid-column: 1;
    grid-row: 4;
  }
}
</style>
