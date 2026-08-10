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
@use '~/design/scss/variables';

.skeleton {
  border-radius: variables.$border-radius-m;
  animation: skeleton-loading 1s linear infinite alternate;
}
</style>
