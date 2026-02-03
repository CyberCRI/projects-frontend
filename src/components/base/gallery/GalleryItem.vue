<template>
  <button
    class="reset-btn gallery-button shadow-box skeletons-background"
    @click.prevent="$emit('click')"
  >
    <img :src="image.src" :alt="image.alt" class="gallery-item" />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    image: any
  }>(),
  {}
)

defineEmits(['click'])
</script>

<style lang="scss">
.gallery-button {
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.gallery-item {
  width: 100%;
  border-radius: 5px;
}
</style>
