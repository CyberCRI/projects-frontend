<template>
  <div class="separator"></div>
  <RouterLink class="project-row" :to="toLink" :data-test="`project-row-${project.id}`">
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
    <!-- header row -->
    <div ref="type" class="card-type">
      <div v-if="mainCategory" class="category-name skeletons-text">
        <span class="main-category">{{ mainCategory.name }}</span>
      </div>
    </div>
    <div class="card-action">
      <ProjectFollowIcon
        v-if="showFollowButton"
        ref="follow"
        :project="project"
        :target-user-id="targetUserId"
      />
    </div>
    <!-- main row -->
    <h2 class="card-title skeletons-text">
      {{ translatedTitle }}
    </h2>
    <p class="card-description skeletons-text">
      {{ translatedPurpose }}
    </p>
    <!-- footer row -->
    <div class="card-tags">
      <ProjectHeaderTagList class="tag-list" :project="project" />
    </div>
    <div class="card-last-update skeletons-text">Last updated {{ lastUpdate }}</div>
  </RouterLink>
</template>

<script setup lang="ts">
import ProjectFollowIcon from '~/components/project/ProjectFollowIcon.vue'
import CroppedApiImage from '~/components/base/media/CroppedApiImage.vue'

import useUsersStore from '~/stores/useUsers'

import type { DEFAULT_PROJECT_PATATOID } from '~/composables/usePatatoids'
import type { TranslatedProject } from 'shared-projects-frontend/models'

const props = defineProps<{
  project: TranslatedProject
}>()

const usersStore = useUsersStore()
const { getTranslatableField } = useAutoTranslate()

const project = computed(() => props.project)
const translatedTitle = getTranslatableField(project, 'title')
const translatedPurpose = getTranslatableField(project, 'purpose')

const toLink = computed(() => {
  return `/projects/${props.project.slug || props.project.id}/summary`
})

const showFollowButton = computed(() => {
  return usersStore.isConnected
})
const targetUserId = computed(() => usersStore.id)

const mainCategory = computed(
  () => (project.value.categories?.length && project.value.categories[0]) || null
)

const { locale } = useNuxtI18n()
const lastUpdate = computed(() =>
  new Date(props.project.updated_at).toLocaleDateString(locale.value, {
    dateStyle: 'short',
  })
)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

$picture-size: 10rem;

.project-row {
  min-height: $picture-size;
  display: grid;
  grid-template: min-content min-content 1fr min-content / $picture-size 1fr max-content;
  grid-template-areas:
    'pict header action'
    'pict title title'
    'pict content content'
    'pict footer date';
  gap: 1rem;
  align-items: stretch;

  @media screen and (max-width: variables.$min-tablet) {
    grid-template: min-content min-content $picture-size min-content min-content min-content / 1fr min-content;
    grid-template-areas:
      'header action'
      'title title'
      'pict pict'
      'content content'
      'footer footer'
      'date date';
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

.card-type {
  grid-area: header;
}

.card-action {
  grid-area: action;
  justify-self: flex-end;
}

.card-title {
  grid-area: title;
}

.card-description {
  grid-area: content;
}

.card-tags {
  grid-area: footer;
  position: relative;
  height: 2rem;

  .tag-list {
    position: absolute;
    inset: 0;
  }
}

.card-last-update {
  grid-area: date;
  justify-self: flex-end;
}

.card-title {
  font-weight: 700;
  font-size: 1.2rem;
}

.main-category {
  color: variables.$primary;
  text-transform: uppercase;
  font-size: 1.2rem;
}

.separator {
  margin-block: 1rem;
  display: none;
  background-color: variables.$light-gray;
  height: 1px;
  margin-right: 66%;

  @media screen and (max-width: variables.$min-tablet) {
    margin-inline: 17%;
  }
}

.project-row ~ .separator {
  display: block;
}
</style>
