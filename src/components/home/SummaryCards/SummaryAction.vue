<template>
  <component :is="to ? 'NuxtLink' : 'vue:span'" :to="to" class="summary-action">
    <IconImage class="icon" :name="actionIcon" />
    <span class="label">{{ capitalize(actionLabel) }}</span>
  </component>
</template>
<script setup>
import { capitalize } from 'es-toolkit'

import IconImage from '@/components/base/media/IconImage.vue'

defineOptions({ name: 'SummaryAction' })

defineProps({
  actionIcon: {
    type: String,
    default: 'ArrowRight',
  },

  actionLabel: {
    type: String,
    default: '',
  },
  to: {
    type: [Object, String, null],
    default: null,
  },
})
</script>
<style lang="scss" scoped>
.summary-action {
  display: flex;
  align-items: center;
  width: min-content;
  cursor: pointer;
  position: relative;

  &::before {
    content: '';
    inset: 0;
    z-index: 0;
    position: absolute;
    transform-origin: center center;
    transform: scale(0, 1);
    transition: 200ms ease-in-out;
    border-bottom: $border-width-m solid $primary-dark;
  }

  &:hover::before {
    transform: scale(1, 1);
  }

  .icon,
  .label {
    position: relative;
    z-index: 1;
  }

  .icon {
    fill: $primary-dark;
    height: $layout-size-2xl;
    width: $layout-size-2xl;
  }

  .label {
    color: $primary-dark;
    font-weight: 700;
    margin-left: $space-xs;
    white-space: nowrap;
  }

  .icon,
  .label {
    transition: transform 0.2s;
    transform-origin: left center;
  }
}
</style>
