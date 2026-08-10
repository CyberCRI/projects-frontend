<template>
  <span :class="{ [color]: !!color }" class="notification-icon" @click="$emit('click')">
    <IconImage name="Bell" />
    <span v-if="notificationCount > 0" class="count">
      <span class="inner">{{ notificationCount }}</span>
    </span>
  </span>
</template>

<script setup lang="ts">
import IconImage from '~/components/base/media/IconImage.vue'

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
@use '~/design/scss/variables';

.notification-icon {
  display: inline-block;
  position: relative;

  svg {
    height: variables.$layout-size-2xl;
    fill: variables.$primary-dark;
  }

  &.white {
    svg {
      fill: variables.$white;
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
    min-width: variables.pxtorem(16px);
    max-width: variables.pxtorem(32px);
    height: variables.pxtorem(16px);
    border-radius: variables.pxtorem(8px);
    background-color: variables.$salmon;

    .inner {
      font-size: variables.$font-size-xs;
      line-height: variables.$line-height-squashed;
      color: variables.$white;
    }
  }
}
</style>
