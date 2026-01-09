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

<script setup lang="ts">
import DynamicGrid from '@/components/base/DynamicGrid.vue'

withDefaults(defineProps<{ limit?: number; minGap?: number; mode?: 'card' | 'list' }>(), {
  limit: 12,
  minGap: 0,
  mode: 'card',
})
</script>

<style lang="scss" scoped>
.card-list {
  margin-top: $space-xl;

  .skeleton-card {
    border-color: $almost-white !important;
    pointer-events: none;
  }

  &.card .skeleton-text {
    padding-top: $space-m;
    width: 100%;
    align-items: center;
  }

  &.list .skeleton-text {
    width: 100%;
    justify-content: center;
    height: 100%;
  }

  .skeleton-text {
    display: flex;
    align-content: center;
    flex-direction: column;
    gap: 0.4rem;
  }

  .image-placeholder {
    width: pxToRem(90px);
    height: pxToRem(90px);
    background: $lighter-gray;
    margin-bottom: $space-l;
    border-radius: 50%;
    animation: skeleton-loading 1s linear infinite alternate;
  }

  .project-picture {
    box-shadow: none !important;
  }

  .text-placeholder {
    background: $lighter-gray;
    border-radius: $border-radius-xs;
    width: 80%;
    height: pxToRem(16px);
    animation: skeleton-loading 1s linear infinite alternate;
  }

  &.list {
    .text-placeholder:first-child {
      width: 20%;
    }
  }

  .subtext {
    margin-bottom: $space-s;
  }

  .footer {
    margin-top: $space-l;
  }
}
</style>
