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
<script setup>
import CroppedImage from '@/components/base/media/CroppedImage.vue'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'

defineOptions({ name: 'CroppedApiImage' })

const props = defineProps({
  pictureData: {
    type: [Object, null],
    required: true,
  },

  pictureSize: {
    type: String, // 'small', 'medium', 'large'
    required: false,
    default: 'medium',
  },

  defaultPicture: {
    type: String,
    required: true,
  },

  //

  alt: {
    type: String,
    required: false,
    default: '',
  },
  contain: {
    type: Boolean,
    required: false,
    default: false,
  },

  ratio: {
    // crop area aspect ratio
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['load', 'error'])
const runtimeConfig = useRuntimeConfig()
const imageLoaded = ref(false)
const imageError = ref(false)

const _src = computed(() => {
  return props.pictureData?.variations?.[props.pictureSize]
})

const src = computed(() => {
  return imageError.value || !_src.value
    ? runtimeConfig.public.appPublicBinariesPrefix + props.defaultPicture
    : _src.value
})

const imageSizes = computed(() => {
  return imageError.value ? null : pictureApiToImageSizes(props.pictureData)
})

const onImageError = (event) => {
  imageError.value = true
  imageLoaded.value = true
  emit('error', event)
}
const onImageLoaded = (event) => {
  imageLoaded.value = true
  emit('load', event)
}
</script>
