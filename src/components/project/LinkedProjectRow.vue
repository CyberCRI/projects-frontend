<template>
  <div class="separator"></div>
  <RouterLink class="project-row" :to="toLink" :data-test="`linked-project-row-${project.id}`">
    <!-- picture -->
    <div class="card-image">
      <CroppedApiImage
        :picture-data="project.header_image"
        picture-size="medium"
        :default-picture="DEFAULT_PROJECT_PATATOID"
        :alt="`${translatedTitle} image`"
        class="picture picture-project skeletons-background"
      />
    </div>

    <h2 class="card-title skeletons-text">
      {{ translatedTitle }}
    </h2>
    <div v-if="project.tags?.length" class="card-tags">
      <ProjectHeaderTagList class="tag-list" :project="project" />
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import CroppedApiImage from '~/components/base/media/CroppedApiImage.vue'

import type { DEFAULT_PROJECT_PATATOID } from '~/composables/usePatatoids'
import type { TranslatedProject } from 'shared-projects-frontend/models'

const props = defineProps<{
  project: TranslatedProject
}>()

const { getTranslatableField } = useAutoTranslate()

const project = computed(() => props.project)
const translatedTitle = getTranslatableField(project, 'title')

const toLink = computed(() => {
  return `/projects/${props.project.slug || props.project.id}/summary`
})
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

$picture-size: variables.pxtorem(51px);

.project-row {
  min-height: $picture-size;
  display: grid;
  grid-template: min-content min-content / $picture-size 1fr;
  grid-template-areas:
    'pict title'
    'pict tags';
  gap: 1rem;
  align-items: stretch;
  border: 1px solid variables.$lighter-gray;
  border-radius: 4px;
  padding: 0.5rem;
  width: 26rem;

  @media screen and (max-width: variables.$min-tablet) {
    grid-template: min-content min-content min-content / 1fr;
    grid-template-areas:
      'title'
      'pict'
      'tags';
  }
}

.card-image {
  grid-area: pict;
  align-content: center;

  @media screen and (max-width: variables.$min-tablet) {
    justify-self: center;
  }
}

.picture-project {
  width: $picture-size;
  height: $picture-size;
}

.card-title {
  grid-area: title;
}

.card-tags {
  grid-area: tags;
  position: relative;
  height: 2rem;

  .tag-list {
    position: absolute;
    inset: 0;
  }
}

.card-title {
  font-weight: 400;
  font-size: 1rem;
}
</style>
