<template>
  <BasicCard
    :to-link="toLink"
    class="project-card"
    :data-test="`project-card-${project.id}`"
    :mode="mode"
    :line-clamp="lineClamp"
    :title="title"
    @click="toProject"
  >
    <template #actions-left>
      <IconImage class="icon passive skeletons-background" :name="visibilityIcon" />
    </template>

    <template #actions-right>
      <ProjectFollowIcon
        v-if="showFollowButton"
        ref="follow"
        :project="project"
        :target-user-id="targetUserId"
        @follow="$emit('card-update')"
        @unfollow="$emit('card-update')"
      />
      <IconImage
        v-if="hasAddIcon"
        class="icon skeletons-background"
        name="Plus"
        @click="$emit('add')"
      />
      <IconImage
        v-if="hasCloseIcon"
        class="icon skeletons-background"
        name="CloseCircle"
        @click="$emit('unselect', project)"
      />
      <IconImage
        v-if="customIcon"
        class="icon skeletons-background"
        :name="customIcon"
        @click="$emit('custom-icon-click', project)"
      />
    </template>
    <CroppedApiImage
      :picture-data="project.header_image"
      picture-size="medium"
      :default-picture="DEFAULT_PROJECT_PATATOID"
      :alt="`${translatedTitle} image`"
      class="picture picture-project skeletons-background"
    />
    <div
      :class="{ 'has-description': translatedPurpose && translatedPurpose.length }"
      class="text text-limit"
    >
      <div ref="type" class="card-type">
        <div
          v-if="project.categories && project.categories.length"
          class="category-name skeletons-text"
        >
          {{ project.categories[0].name }}
        </div>
      </div>
      <h2 class="card-title skeletons-text">
        {{ translatedTitle }}
      </h2>
      <p class="card-description skeletons-text">
        {{ translatedPurpose }}
      </p>
    </div>
  </BasicCard>
</template>

<script setup lang="ts">
import ProjectFollowIcon from '~/components/project/ProjectFollowIcon.vue'
import CroppedApiImage from '~/components/base/media/CroppedApiImage.vue'
import IconImage from '~/components/base/media/IconImage.vue'
import BasicCard from '~/components/base/BasicCard.vue'

import useUsersStore from '~/stores/useUsers'

import type { DEFAULT_PROJECT_PATATOID } from '~/composables/usePatatoids'
import type { TranslatedProject } from '~/models/project.model'
import type { IconImageChoice } from '~/functs/IconImage'

const props = withDefaults(
  defineProps<{
    // TODO: change to only translatedPRoject (projectModel used in search/profile)
    project: TranslatedProject
    hasAddIcon?: boolean
    hasCloseIcon?: boolean
    customIcon?: IconImageChoice
    followOnClick?: boolean
    targetUserId?: number
    mode?: 'card' | 'list'
  }>(),
  {
    hasAddIcon: false,
    hasCloseIcon: false,
    customIcon: null,
    followOnClick: false,
    targetUserId: null,
    mode: 'card',
  }
)

const emit = defineEmits<{
  add: []
  unselect: [TranslatedProject]
  click: []
  'get-info': []
  'navigated-away': []
  'card-update': []
  'custom-icon-click': [TranslatedProject]
}>()

const usersStore = useUsersStore()
const { getTranslatableField } = useAutoTranslate()

const project = computed(() => props.project)
const translatedTitle = getTranslatableField(project, 'title')
const translatedPurpose = getTranslatableField(project, 'purpose')

const toLink = computed(() => {
  // a to-link attribute make the basic card a NuxtLink
  // witch we dont want when just selecting project
  return props.hasAddIcon || props.hasCloseIcon || props.followOnClick
    ? null
    : `/projects/${props.project.slug || props.project.id}/summary`
})

const showFollowButton = computed(() => {
  return !props.hasAddIcon && !props.customIcon && !props.hasCloseIcon && usersStore.isConnected
})

const visibilityIcon = computed<IconImageChoice>(() => {
  switch (props.project.publication_status) {
    case 'org':
      return 'PeopleGroup'
    case 'private':
      return 'EyeSlash'
    case 'public':
      return 'Eye'
    default:
      return null
  }
})

const followRef = useTemplateRef('follow')
const toProject = () => {
  // this is a quick and dirty fix to make whole card clickable for selection
  if (props.hasAddIcon) {
    emit('add')
  } else if (props.hasCloseIcon) {
    emit('unselect', props.project)
  } else if (props.followOnClick) {
    followRef.value.actionFollow()
  } else {
    emit('navigated-away')
  }
}

// calculate lineClamp description
const lineClamp = computed(() => {
  let defaultLineClamp = 6
  if (props.project.categories?.length) {
    defaultLineClamp += 1
  }
  return defaultLineClamp
})

const title = computed(() => `${translatedTitle.value}\n\n${translatedPurpose.value}`.trim())
</script>

<style lang="scss" scoped>
.icon {
  fill: $primary-dark;
}
</style>
