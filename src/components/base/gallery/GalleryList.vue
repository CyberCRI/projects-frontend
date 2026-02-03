<template>
  <div class="gallery-grid">
    <GalleryItem
      v-for="image in images"
      :key="image.id"
      :image="image"
      @click="$emit('click', image)"
    />
  </div>
</template>

<script setup lang="ts">
import GalleryItem from '@/components/base/gallery/GalleryItem.vue'
import { ImageGallery } from '@/interfaces/gallery'

withDefaults(
  defineProps<{
    images: ImageGallery[]
  }>(),
  {}
)

defineEmits(['click'])
</script>

<style lang="scss">
.gallery-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
  width: 100%;
  height: 100%;

  @media screen and (min-width: $min-desktop) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  @media screen and (max-width: $min-tablet) {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
