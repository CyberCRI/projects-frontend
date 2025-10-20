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
      default-picture="/placeholders/header_placeholder.png"
    />
    <div class="project-title">
      {{ capitalize(project?.$t?.title) }}
    </div>
  </NuxtLink>
</template>

<script setup>
import { capitalize } from 'es-toolkit'

import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'

definePorps({ name: 'ProjectLine' })

definePorps({
  project: {
    type: Object,
    required: true,
  },
})
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
