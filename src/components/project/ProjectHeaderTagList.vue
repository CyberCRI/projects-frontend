<template>
  <div class="tag-list-ctn">
    <div v-if="loading" class="tag-ctn-skeleton">
      <SkeletonComponent height="19px" width="50px" />
      <SkeletonComponent height="19px" width="50px" />
      <SkeletonComponent height="19px" width="50px" />
    </div>

    <TagsList
      v-else-if="project?.tags?.length"
      :tags="project.tags"
      class="tag-list"
      :prefix="tagPrefix"
    />
  </div>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  tagPrefix: {
    type: String,
    required: false,
    default: 'desktop',
  },
})
</script>

<style scoped lang="scss">
.tag-ctn-skeleton {
  margin: 0;
  margin-top: $space-l;
  display: flex;
  flex-wrap: nowrap;
  gap: $space-2xs;
  overflow: hidden;
}

.tag-list {
  margin-top: $space-l;
  margin-bottom: $space-l;

  @media screen and (max-width: $min-tablet) {
    margin-top: 0;
    margin-bottom: 0;
  }
}

.tag-list + .sdg-ctn {
  margin-top: $space-l;
}
</style>
