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

defineEmits<{
  click: [MouseEvent]
}>()
</script>

<template>
  <!-- we add @click.prevent to add css wait cursor (not working in pointer-event: none) -->
  <div
    :class="{
      asyncing,
      'fetch-async': true,
    }"
    @click.prevent="!asyncing && $emit('click', $event)"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.fetch-async {
  display: contents;

  &.asyncing {
    cursor: wait !important;

    &:deep(*) {
      pointer-events: none !important;
      user-select: none !important;
      opacity: v-bind('opacity') !important;
    }
  }
}
</style>
