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
import DynamicGrid from '~/components/base/DynamicGrid.vue'

withDefaults(defineProps<{ limit?: number; minGap?: number; mode?: 'card' | 'list' }>(), {
  limit: 12,
  minGap: 0,
  mode: 'card',
})
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.card-list {
  margin-top: variables.$space-xl;

  .skeleton-card {
    border-color: variables.$almost-white !important;
    pointer-events: none;
  }

  &.card .skeleton-text {
    padding-top: variables.$space-m;
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
    width: variables.pxtorem(90px);
    height: variables.pxtorem(90px);
    background: variables.$lighter-gray;
    margin-bottom: variables.$space-l;
    border-radius: 50%;
    animation: skeleton-loading 1s linear infinite alternate;
  }

  .project-picture {
    box-shadow: none !important;
  }

  .text-placeholder {
    background: variables.$lighter-gray;
    border-radius: variables.$border-radius-xs;
    width: 80%;
    height: variables.pxtorem(16px);
    animation: skeleton-loading 1s linear infinite alternate;
  }

  &.list {
    .text-placeholder:first-child {
      width: 20%;
    }
  }

  .subtext {
    margin-bottom: variables.$space-s;
  }

  .footer {
    margin-top: variables.$space-l;
  }
}
</style>
