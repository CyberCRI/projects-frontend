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
import CroppedImage from '@/components/base/media/CroppedImage.vue'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils'
import { ImageModel } from '@/models/image.model'

defineOptions({ name: 'CroppedApiImage' })

const props = withDefaults(
  defineProps<{
    pictureData?: ImageModel
    pictureSize?: 'small' | 'medium' | 'large'
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
const runtimeConfig = useRuntimeConfig()
const imageLoaded = ref(false)
const imageError = ref(false)

const _src = computed(() => {
  return props.pictureData?.variations?.[props.pictureSize]
})

const src = computed(() => {
  if (imageError.value) {
    return ''
  }
  return _src.value || `${runtimeConfig.public.appPublicBinariesPrefix}${props.defaultPicture}`
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
