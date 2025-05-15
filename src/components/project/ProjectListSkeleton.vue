<template>
  <DynamicGrid :min-gap="minGap" class="card-list" :mode="mode">
    <BasicCard v-for="(item, index) in limit" :key="index" class="skeleton-card" :mode="mode">
      <div class="picture project-picture">
        <div class="image-placeholder" />
      </div>

      <div class="skeleton-text">
        <div class="text-placeholder" />

        <div v-if="mode == 'card'" class="text-placeholder subtext" />

        <div class="text-placeholder" />

        <div class="text-placeholder" />
      </div>
    </BasicCard>
  </DynamicGrid>
</template>

<script>
import DynamicGrid from '@/components/base/DynamicGrid.vue'
export default {
  name: 'ProjectListSkeleton',

  components: {
    DynamicGrid,
  },

  props: {
    limit: {
      type: Number,
      default: 12,
    },
    minGap: {
      type: Number,
      default: 0,
    },
    mode: {
      type: String,
      default: 'card', // 'card' or 'list'
    },
  },
}
</script>

<style lang="scss" scoped>
.card-list {
  margin-top: $space-xl;

  .skeleton-card {
    border-color: $almost-white !important;
  }

  &.card .skeleton-text {
    padding-top: $space-m;
    width: 100%;
  }

  &.list .skeleton-text {
    width: 100%;
  }

  .image-placeholder {
    width: pxToRem(72px);
    height: pxToRem(72px);
    background: $lighter-gray;
    margin-bottom: $space-l;
    border-radius: $border-radius-xs;
    animation: skeleton-loading 1s linear infinite alternate;
  }

  .text-placeholder {
    background: $lighter-gray;
    border-radius: $border-radius-xs;
    width: 100%;
    height: pxToRem(16px);
    margin-bottom: pxToRem(16px);
    animation: skeleton-loading 1s linear infinite alternate;
  }

  .subtext {
    margin-bottom: $space-s;
  }

  .footer {
    margin-top: $space-l;
  }
}
</style>
