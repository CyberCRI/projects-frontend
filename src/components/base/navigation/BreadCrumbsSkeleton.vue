<template>
  <div class="group">
    <SkeletonComponent width="110px" class="item" />
    <SkeletonComponent width="150px" class="item" />
    <SkeletonComponent width="70px" class="item" />
  </div>
</template>

<script>
import SkeletonComponent from '@/components/base/loader/SkeletonComponent.vue'
export default {
  name: 'BreadCrumbsSkeleton',
  components: { SkeletonComponent },
}
</script>

<style lang="scss" scoped>
.group {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: $space-2xs;
  margin: $space-unit 0;

  .item {
    height: 15px;
    border-radius: $border-radius-m;
  }
}
</style>
