<template>
  <component :is="tag" :style="{ height, width, 'border-radius': borderRadius }" class="skeleton" />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tag?: string
    height?: string
    width?: string
    borderRadius?: string
  }>(),
  {
    tag: 'div',
    height: '',
    width: '',
    borderRadius: '',
  }
)
</script>

<style lang="scss" scoped>
.skeleton {
  border-radius: $border-radius-m;
  animation: skeleton-loading 1s linear infinite alternate;
}
</style>
