<template>
  <div class="project-preview">
    <NuxtLink
      class="project-link"
      :to="{
        name: 'ProjectSnapshot',
        params: {
          slugOrId: project.slug,
        },
      }"
    >
      <CroppedApiImage
        :alt="`${project.$t.title} image`"
        :picture-data="project.header_image"
        picture-size="small"
        class="skeletons-background"
        :default-picture="DEFAULT_PROJECT_PATATOID"
      />

      <div class="project-info">
        <div class="project-texts">
          <h3 class="skeletons-text text-ellipsis">{{ project.$t.title }}</h3>
          <pre class="skeletons-text text-ellipsis">{{ project.$t.purpose }}</pre>
        </div>
        <div class="project-tags">
          <TagsList
            :tags="tags"
            :to="{
              name: 'ProjectSearch',
              query: {
                section: 'projects',
              },
            }"
          />
        </div>
      </div>
    </NuxtLink>
    <div v-if="extra" class="project-extra">
      <slot name="action">
        <ProjectFollowIcon
          class="icon skeletons-background"
          :project="project"
          @follow="emit('refresh')"
          @unfollow="emit('refresh')"
        />
        <time class="project-date skeletons-text" :datetime="project.updated_at">
          {{ lastUpdated }}
        </time>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TranslatedProject } from '~/models/project.model'

import ProjectFollowIcon from '~/components/project/ProjectFollowIcon.vue'
import TagsList from '~/components/tags/TagsList.vue'

import { DEFAULT_PROJECT_PATATOID } from '~/composables/usePatatoids'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    extra?: boolean
  }>(),
  { extra: true }
)

const emit = defineEmits(['refresh'])

const { locale } = useNuxtI18n()
const tags = computed(() => (props.project.tags ?? []).slice(0, 3))
const lastUpdated = computed(() => {
  return new Date(props.project.updated_at).toLocaleDateString(locale.value)
})
</script>

<style lang="scss" scoped>
.project-preview {
  display: grid;
  grid-template-columns: 1fr 87px;
  column-gap: 1rem;
  position: relative;
  z-index: 2;
}

.project-link {
  display: grid;
  grid-template-columns: 87px 1fr;
  column-gap: 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: scale(102%);
  }
}

.cropped-image {
  border-radius: 10px;
  height: 87px;
}

.project-info {
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 0.2rem;

  .project-texts {
    overflow: hidden;
  }
}

.project-extra {
  display: grid;
  grid-template-rows: 1fr auto;
  place-items: baseline end;

  .project-date {
    align-self: flex-end;
  }

  .icon {
    width: pxToRem(30px);
  }
}

.project-info-purpose {
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
</style>
