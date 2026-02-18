<template>
  <div class="gallery-grid">
    <template v-for="image in images">
      <slot :image="image">
        <GalleryItem
          :key="image.url"
          :image="image"
          :editable="editable"
          :size="imageSize"
          :style-img="{ objectFit: 'cover' }"
          @delete="$emit('delete', image)"
          @click="$emit('click', image)"
        />
      </slot>
    </template>
  </div>
</template>

<script setup lang="ts">
import GalleryItem from '@/components/base/gallery/GalleryItem.vue'
import { ImageModel } from '@/models/image.model'

withDefaults(
  defineProps<{
    images: ImageModel[]
    editable?: boolean
    imageSize?: keyof ImageModel['variations']
  }>(),
  { editable: false, imageSize: null }
)

defineEmits<{
  click: [ImageModel]
  delete: [ImageModel]
}>()
</script>

<style lang="scss">
.gallery-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
  width: 100%;
  height: 100%;

  > * {
    height: pxToRem(130px);
  }

  @media screen and (min-width: $min-desktop) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  @media screen and (max-width: $min-tablet) {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
