<template>
  <NuxtLink
    class="drop-down-menu-item-content"
    :to="{
      name: 'Category',
      params: { slugOrId: category.slug || category.id },
    }"
  >
    <span class="label">{{ category.$t.name }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { TranslatedProjectCategory } from 'shared-projects-frontend/models'

defineProps<{
  category: TranslatedProjectCategory
}>()
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.drop-down-menu-item-content {
  color: variables.$primary-dark;
  padding: variables.$space-m variables.$space-s;
  font-size: variables.$font-size-s;
  display: flex;
  align-items: center;
  font-family: Ubuntu, 'Noto Sans SC', helvetica, arial, sans-serif;

  .label {
    transform-origin: left center;
    transition: transform 200ms ease-in-out;
    font-weight: 400;
    font-size: variables.$font-size-m;
    transform: translateZ(0);
  }

  &:hover {
    background-color: variables.$primary-light;

    .label {
      transform: translateZ(0) scaleX(1.1);
    }
  }
}
</style>
