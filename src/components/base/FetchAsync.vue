<script lang="ts" setup>
withDefaults(
  defineProps<{
    asyncing?: boolean
    opacity?: number
  }>(),
  {
    asyncing: false,
    opacity: 0.8,
  }
)
</script>

<template>
  <div
    :class="{
      asyncing,
      'fetch-async': true,
    }"
  >
    <slot />
  </div>
</template>

<style lang="scss">
.fetch-async {
  display: contents;

  &.asyncing * {
    pointer-events: none !important;
    user-select: none !important;
    cursor: wait !important;
    opacity: v-bind('opacity') !important;
  }
}
</style>
