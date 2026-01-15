<template>
  <div
    :key="url"
    class="category-card-image"
    :style="`height: ${imageHeight}; width: ${imageWidth};background-size: cover;`"
  >
    <CroppedImage
      v-if="url"
      :ratio="16 / 9"
      :src="url"
      from-center
      :image-sizes="imageSizes"
      class="image"
      :style="imageStyle"
    />
    <CategoryCardDefaultBackground
      v-else
      :image-height="imageHeight"
      :image-width="imageWidth"
      :shapes-color="shapesColor"
      :background-color="backgroundColor"
    />
  </div>
</template>

<script setup lang="ts">
import CategoryCardDefaultBackground from '@/components/category/CategoryCardDefaultBackground.vue'
import CroppedImage from '@/components/base/media/CroppedImage.vue'
import { ImageSizes } from '@/functs/imageSizesUtils'

const props = withDefaults(
  defineProps<{
    backgroundColor: string
    shapesColor?: string
    imageHeight: string
    imageWidth: string
    url?: string
    imageSizes?: ImageSizes
    forcedRatio?: number
  }>(),
  {
    shapesColor: '#FFF',
    url: null,
    imageSizes: null,
    forcedRatio: null,
  }
)

const imageStyle = computed(() => {
  if (props.forcedRatio) {
    return {
      display: 'flex', // ??? but this only work
      position: 'static',
      width: '100%',
      height: 'auto',
      transform: 'none',
      aspectRatio: props.forcedRatio,
      paddingBottom: 0,
    }
  }
  return {}
})
</script>

<style lang="scss" scoped>
.category-card-image {
  overflow: hidden;
  position: relative;
}

.image {
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 0;
  padding-bottom: calc((9 / 16) * 100%);
  transform: translate(-50%, -50%);
}

:deep(.cropped-image img) {
  width: auto;
  min-width: 100%;
}
</style>
