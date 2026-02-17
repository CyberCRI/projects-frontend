<template>
  <NuxtLink
    :to="{ name: 'pageProject', params: { slugOrId: project.slug || project.id } }"
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
      {{ capitalize(project?.$t?.title) }}
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { capitalize } from '@/functs/string'

import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import { DEFAULT_PROJECT_PATATOID } from '@/composables/usePatatoids'
import { TranslatedProject } from '@/models/project.model'

defineProps<{
  project: TranslatedProject
}>()
</script>

<style lang="scss" scoped>
.line {
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: $primary-lighter;
  }
}

.img-container {
  border-radius: $border-radius-s;
  background-size: cover;
  background-position: top center;
  width: 50px;
  height: 50px;
  flex: none;
  margin-right: $space-s;
}

.project-title {
  font-weight: 700;
  color: $primary-dark;
  -webkit-line-clamp: 1;
  line-height: $line-height-tight;
}
</style>
