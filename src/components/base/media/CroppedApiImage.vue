<template>
  <CroppedImage
    :src="src"
    :image-sizes="imageSizes"
    :alt="alt"
    :contain="contain"
    :ratio="ratio"
    @error="onImageError"
    @load="onImageLoaded"
  />
</template>
<script setup lang="ts">
import type { ImageModel } from '~/models/image.model'

import CroppedImage from '~/components/base/media/CroppedImage.vue'

import { usePublicURL } from '~/composables/usePublic'

import { pictureApiToImageSizes } from '~/functs/imageSizesUtils'

defineOptions({ name: 'CroppedApiImage' })

const props = withDefaults(
  defineProps<{
    pictureData?: ImageModel
    pictureSize?: keyof ImageModel['variations']
    defaultPicture: string
    alt?: string
    contain?: boolean
    ratio?: number
  }>(),
  {
    pictureData: null,
    pictureSize: 'medium',
    alt: '',
    contain: false,
    // crop area aspect ratio
    ratio: 1,
  }
)

const emit = defineEmits<{
  load: [Event]
  error: [Error]
}>()
const imageLoaded = ref(false)
const imageError = ref(false)

const src = computed(() => {
  const defaultPicture = usePublicURL(props.defaultPicture)
  if (imageError.value) {
    return defaultPicture
  }
  return props.pictureData?.variations?.[props.pictureSize] || defaultPicture
})

const imageSizes = computed(() => {
  return imageError.value ? null : pictureApiToImageSizes(props.pictureData)
})

const onImageError = (error) => {
  imageError.value = true
  imageLoaded.value = true
  emit('error', error)
}
const onImageLoaded = (event) => {
  imageLoaded.value = true
  emit('load', event)
}
</script>
