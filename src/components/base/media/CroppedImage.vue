<template>
  <div class="cropped-image" :class="{ contain, loading: loadStatus }">
    <img :alt="alt" :src="src" :style="imageStyles" @load="onLoad" @error="onError" />
  </div>
</template>
<script setup lang="ts">
import { ImageSizes, IMAGES_SIZES_DEFAULTS } from '@/functs/imageSizesUtils'
import { StyleValue } from 'vue'

const props = withDefaults(
  defineProps<{
    imageSizes?: ImageSizes
    src?: string
    alt?: string
    contain?: boolean
    ratio?: number
  }>(),
  {
    imageSizes: null,
    src: null,
    alt: '',
    contain: false,
    // crop area aspect ratio
    ratio: 1,
  }
)

const emit = defineEmits<{
  load: [Event]
  error: [Error | Event]
}>()

const imageStyles = computed<StyleValue>(() => {
  // create "fake" image size to use the same imageStyle for every pictures
  const imageSizes = props.imageSizes || IMAGES_SIZES_DEFAULTS
  return {
    width: props.ratio >= imageSizes.naturalRatio ? '100%' : 'auto',
    height: props.ratio < imageSizes.naturalRatio ? '100%' : 'auto',
    objectFit: 'unset',
    objectPosition: 'unset',
    transform: `translateZ(0)  scale(${imageSizes.scaleX}, ${imageSizes.scaleY}) translate(${imageSizes.left}%, ${imageSizes.top}%)`,
    position: 'absolute',
    top: 0,
    left: 0,
    'transform-origin': 'top left',
  }
})

// this create a skeleton on every image during load
const loadStatus = ref(true)
watch(
  () => props.src,
  () => (loadStatus.value = true)
)
const onLoad = (event) => {
  loadStatus.value = false
  emit('load', event)
}

const onError = (event) => emit('error', event)

onMounted(() => {
  if (!props.src) {
    // chrome doesn't trigger error on null src so do it manually
    emit('error', new Error('src is null'))
  }
})
</script>
<style lang="scss" scoped>
@import '@/design/scss/skeletons';

.cropped-image {
  // higher specificity to override BasicCard styles
  overflow: hidden;
  display: flex; // needed for contained image white background not to cover the whole container
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    object-fit: cover;
    object-position: center;
    background-color: $white; // request of Wien University for transparent images
    flex-grow: 1;
    flex-basis: 0; // so image take minimum space possible to cover conbtainer
  }

  &.contain {
    align-items: center;

    img {
      object-fit: contain;
    }
  }

  &.loading {
    @extend %skeleton-background-block;
  }
}
</style>
