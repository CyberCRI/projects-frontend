<template>
  <div class="project-header-image-ctn">
    <SkeletonComponent v-if="loading" height="100%" width="100%" />

    <CroppedApiImage
      v-if="!loading && project?.header_image?.variations"
      :picture-data="project.header_image"
      picture-size="medium"
      default-picture="/placeholders/header_placeholder.png"
      :alt="`${project.title} image`"
    />
  </div>
</template>
<script setup>
/*const props = */ defineProps({
  project: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})
</script>
<style scoped lang="scss">
.project-header-image-ctn {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius-l;
  overflow: hidden;
  background-color: $white;

  .cropped-image {
    width: 100%;
    height: 100%;
  }

  &.img-mobile-ctn .cropped-image {
    border-radius: $border-radius-l;
  }
}
</style>
