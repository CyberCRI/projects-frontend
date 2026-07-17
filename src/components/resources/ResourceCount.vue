<template>
  <NuxtLink :to="target" class="resource-count shadow-box skeletons-background">
    <div class="icon-ctn">
      <div v-if="isFile" class="resource-type">
        <IconImage name="Archive" />
        <span>{{ $t('file.attachment', count) }}</span>
      </div>
      <div v-else class="resource-type">
        <IconImage name="Globe" />
        <span>{{ $t('resource.web-link', count) }}</span>
      </div>
    </div>

    <div class="count">
      {{ count }}
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import IconImage from '~/components/base/media/IconImage.vue'

import type { RouteLocationRaw } from 'vue-router'

withDefaults(
  defineProps<{
    count: number
    target: RouteLocationRaw
    isFile?: boolean
  }>(),
  { isFile: true }
)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.resource-count {
  cursor: pointer;
  border: variables.$border-width-s solid var(--primary);
  border-radius: variables.$border-radius-m;
  overflow: hidden;
  width: 150px;
  transition: 0.3s background-color ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: var(--white);

  &:hover {
    background-color: var(--primary-lighter);
  }

  .icon-ctn {
    padding: variables.$space-m 0;

    .resource-type {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: variables.$font-size-s;
      font-weight: bold;
      color: var(--black);
      text-align: center;

      svg {
        height: 50px;
        width: 50px;
        fill: var(--primary-dark);
        margin-bottom: variables.$space-s;
      }
    }
  }

  .count {
    background: var(--primary);
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: var(--white);
    padding: variables.$space-s 0;
    font-size: variables.$font-size-2xl;
  }
}
</style>
