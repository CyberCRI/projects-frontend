<template>
  <div class="project-header-image-ctn">
    <CroppedApiImage
      :picture-data="project.header_image"
      class="skeletons-background"
      picture-size="medium"
      default-picture="/placeholders/header_placeholder.png"
      :alt="`${project.title} image`"
    />
  </div>
</template>

<script setup lang="ts">
import type { TranslatedProject } from '@/models/project.model'

defineProps<{
  project: TranslatedProject
}>()
</script>
<style scoped lang="scss">
.project-header-image-ctn {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius-l;
  overflow: hidden;
  background-color: $white;
  position: absolute;
  inset: 0;

  .cropped-image {
    width: 100%;
    height: 100%;
  }

  &.img-mobile-ctn .cropped-image {
    border-radius: $border-radius-l;
  }
}
</style>
