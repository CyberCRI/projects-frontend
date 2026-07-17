<template>
  <div class="group">
    <SkeletonComponent width="110px" class="item" />
    <SkeletonComponent width="150px" class="item" />
    <SkeletonComponent width="70px" class="item" />
  </div>
</template>

<script setup lang="ts">
import SkeletonComponent from '~/components/base/loader/SkeletonComponent.vue'
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.group {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: variables.$space-2xs;
  margin: variables.$space-unit 0;

  .item {
    height: 15px;
    border-radius: variables.$border-radius-m;
  }
}
</style>
