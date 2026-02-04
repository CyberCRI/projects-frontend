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
  border-radius: $border-radius-l;
  overflow: hidden;
  height: 260px;
  width: 260px;
  background-color: $white;
  display: flex;
  justify-content: center;
  align-items: center;

  .cropped-image {
    width: 100%;
    height: 100%;
  }

  &.img-mobile-ctn .cropped-image {
    border-radius: $border-radius-l;
  }
}
</style>
