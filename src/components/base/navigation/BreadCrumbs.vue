<template>
  <div v-if="!isLoading" class="breadcrumbs">
    <NuxtLink to="/" class="home-icon skeletons-text">
      <IconImage name="Home" />
    </NuxtLink>
    <span v-for="(breadcrumb, index) in breadcrumbs" :key="index" class="item skeletons-text">
      <NuxtLink :to="breadcrumb.route" class="item-link">{{ breadcrumb.name }}</NuxtLink>
      <span v-if="index !== breadcrumbs.length - 1" class="item-icon">
        <IconImage name="ChevronRight" />
      </span>
    </span>
    <span v-if="groupName" class="item skeletons-text">
      <span class="item-icon">
        <IconImage name="ChevronRight" />
      </span>
      <NuxtLink :to="$route.path" class="item-link">{{ groupName }}</NuxtLink>
    </span>
  </div>
  <BreadCrumbsSkeleton v-else />
</template>

<script setup lang="ts">
import BreadCrumbsSkeleton from '~/components/base/navigation/BreadCrumbsSkeleton.vue'
import IconImage from '~/components/base/media/IconImage.vue'

import type { RouteLocationRaw } from 'vue-router'

export type BreadCrumbItem = { route: RouteLocationRaw; name: string }

withDefaults(
  defineProps<{
    breadcrumbs: BreadCrumbItem[]
    groupName?: string
    isLoading?: boolean
  }>(),
  {
    groupName: '',
    isLoading: false,
  }
)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.breadcrumbs {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: variables.$space-2xs;
  padding: variables.$space-unit 0;

  .item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: variables.$space-2xs;

    &-link {
      color: variables.$primary-dark;
      font-size: variables.$font-size-s;
      font-weight: 400;
    }

    &-icon svg {
      fill: variables.$primary-dark;
      width: variables.$layout-size-xl;
      height: variables.$layout-size-m;
    }
  }

  .home-icon svg {
    fill: variables.$primary-dark;
    width: variables.$layout-size-xl;
    height: variables.$layout-size-m;
  }
}
</style>
