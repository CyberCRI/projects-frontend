<template>
  <div class="project-preview">
    <NuxtLink
      class="project-link"
      :to="{
        name: 'projectSummary',
        params: {
          slugOrId: project.slug,
        },
      }"
    >
      <CroppedApiImage
        :alt="`${project.$t.title} image`"
        :picture-data="project.header_image"
        picture-size="small"
        class="skeletons-image"
        default-picture="/placeholders/header_placeholder.png"
      />

      <div class="project-info">
        <h3 class="skeletons-text">{{ project.$t.title }}</h3>
        <pre class="skeletons-text">{{ purpose }}</pre>
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
    </NuxtLink>
    <div class="project-extra">
      <slot name="action">
        <ProjectFollowIcon
          class="icon"
          :project="project"
          @follow="emit('refresh')"
          @unfollow="emit('refresh')"
        />
        <time class="skeletons-text" :datetime="project.updated_at">
          {{ lastUpdated }}
        </time>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectFollowIcon from '@/components/project/ProjectFollowIcon.vue'
import TagsList from '@/components/common/TagsList.vue'
import { cropIfTooLong } from '@/functs/string'
import { TranslatedProject } from '@/models/project.model'

const props = defineProps<{
  project: TranslatedProject
}>()

const emit = defineEmits(['refresh'])

const { locale } = useNuxtI18n()
const purpose = computed(() => cropIfTooLong(props.project.$t.purpose, 50))
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
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.project-extra {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}

.icon {
  width: 30px;
}
</style>
