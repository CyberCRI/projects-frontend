<template>
  <span :class="{ [color]: !!color }" class="notification-icon" @click="$emit('click')">
    <IconImage name="Bell" />
    <span v-if="notificationCount > 0" class="count">
      <span class="inner">{{ notificationCount }}</span>
    </span>
  </span>
</template>

<script setup lang="ts">
import IconImage from '@/components/base/media/IconImage.vue'

withDefaults(
  defineProps<{
    notificationCount?: number
    color?: string
  }>(),
  { notificationCount: 0, color: '' }
)

defineEmits<{ click: [] }>()
</script>

<style lang="scss" scoped>
.notification-icon {
  display: inline-block;
  position: relative;

  svg {
    height: $layout-size-2xl;
    fill: $primary-dark;
  }

  &.white {
    svg {
      fill: $white;
    }
  }

  .count {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(25%, -25%);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: pxToRem(16px);
    max-width: pxToRem(32px);
    height: pxToRem(16px);
    border-radius: pxToRem(8px);
    background-color: $salmon;

    .inner {
      font-size: $font-size-xs;
      line-height: $line-height-squashed;
      color: $white;
    }
  }
}
</style>
