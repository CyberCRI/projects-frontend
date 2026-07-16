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
import type { ImageModel, ImageVariations } from 'shared-projects-frontend/models'

import GalleryItem from '~/components/base/gallery/GalleryItem.vue'

withDefaults(
  defineProps<{
    images: ImageModel[]
    editable?: boolean
    imageSize?: ImageVariations
  }>(),
  { editable: false, imageSize: null }
)

defineEmits<{
  click: [ImageModel]
  delete: [ImageModel]
}>()
</script>

<style lang="scss">
@use '~/design/scss/variables';

.gallery-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
  width: 100%;
  height: 100%;

  > * {
    height: variables.pxtorem(130px);
  }

  @media screen and (min-width: variables.$min-desktop) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  @media screen and (max-width: variables.$min-tablet) {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
