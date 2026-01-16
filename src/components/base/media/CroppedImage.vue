<template>
  <div class="cropped-image" :class="{ contain }">
    <img
      :alt="alt"
      :src="src"
      :style="imageStyles"
      @load="$emit('load', $event)"
      @error="$emit('error', $event)"
    />
  </div>
</template>
<script setup lang="ts">
import { ImageSizes } from '@/functs/imageSizesUtils'
import { CSSProperties } from 'vue'

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

const imageStyles = computed(() => {
  if (props.imageSizes) {
    return {
      width: props.ratio >= props.imageSizes.naturalRatio ? '100%' : 'auto',
      height: props.ratio < props.imageSizes.naturalRatio ? '100%' : 'auto',
      objectFit: 'unset' as CSSProperties['object-fit'],
      objectPosition: 'unset',
      transform: `translateZ(0)  scale(${props.imageSizes.scaleX}, ${props.imageSizes.scaleY}) translate(${props.imageSizes.left}%, ${props.imageSizes.top}%)`,
      // position: 'absolute',
      top: 0,
      left: 0,
      'transform-origin': 'top left',
    }
  } else {
    return {
      transform: `translateZ(0) translate(0,0) scale(1,1)`,
    }
  }
})

onMounted(() => {
  if (!props.src) {
    // chrome doesn't trigger error on null src so do it manually
    emit('error', new Error('src is null'))
  }
})
</script>
<style lang="scss" scoped>
.cropped-image {
  // higher specificity to override BasicCard styles
  overflow: hidden;
  display: flex; // needed for contained image white background not to cover the whole container
  justify-content: center;
  position: relative;

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
}
</style>
