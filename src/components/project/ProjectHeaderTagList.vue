<template>
  <div class="tag-list-ctn">
    <div v-if="loading" class="tag-ctn-skeleton">
      <SkeletonComponent height="19px" width="50px" />
      <SkeletonComponent height="19px" width="50px" />
      <SkeletonComponent height="19px" width="50px" />
    </div>

    <TagsList v-else-if="project?.tags?.length" :tags="project.tags" class="tag-list" />
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
})
</script>

<style scoped lang="scss">
.tag-ctn-skeleton {
  margin: 0;
  display: flex;
  flex-wrap: nowrap;
  gap: $space-2xs;
  overflow: hidden;
}
</style>
