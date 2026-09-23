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
    asyncing: {{ asyncing }}
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.fetch-async {
  display: contents;

  &.asyncing {
    pointer-events: none !important;
    user-select: none !important;
    opacity: v-bind('opacity') !important;
  }
}
</style>
