<template>
  <NuxtLink
    class="similar-project"
    :to="{
      name: 'projectSummary',
      params: {
        slugOrId: project?.slug,
      },
    }"
  >
    <CroppedApiImage
      v-if="project?.header_image"
      :alt="`${project?.$t?.title} image`"
      :picture-data="project.header_image"
      picture-size="small"
      :default-picture="DEFAULT_PROJECT_PATATOID"
    />

    <p>{{ project?.$t?.title }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import { DEFAULT_PROJECT_PATATOID } from '@/composables/usePatatoids'
import { TranslatedProject } from '@/models/project.model'

defineProps<{
  project?: TranslatedProject
}>()
</script>

<style lang="scss" scoped>
.similar-project {
  display: flex;
  align-items: center;
  cursor: pointer;

  .cropped-image {
    margin-right: $space-s;
    flex: 0 0 72px;
    height: 72px;
    border-radius: $border-radius-xs;
  }

  p {
    color: var(--similar-project-text-color, $white);
    font-size: $font-size-s;
    font-weight: 400;
  }
}
</style>
