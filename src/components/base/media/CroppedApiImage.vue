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
<script>
import CroppedImage from '@/components/base/media/CroppedImage.vue'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
export default {
  name: 'CroppedApiImage',

  components: { CroppedImage },

  props: {
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
  },

  emits: ['load', 'error'],

  setup() {
    const runtimeConfig = useRuntimeConfig()
    return {
      runtimeConfig,
    }
  },

  data() {
    return {
      imageLoaded: false,
      imageError: false,
    }
  },

  computed: {
    _src() {
      return this.pictureData?.variations[this.pictureSize]
    },

    src() {
      return this.imageError || !this._src
        ? this.runtimeConfig.public.appPublicBinariesPrefix + this.defaultPicture
        : this._src
    },

    imageSizes() {
      return this.imageError ? null : pictureApiToImageSizes(this.pictureData)
    },
  },

  methods: {
    onImageError(event) {
      this.imageError = true
      this.imageLoaded = true
      this.$emit('error', event)
    },
    onImageLoaded(event) {
      this.imageLoaded = true
      this.$emit('load', event)
    },
  },
}
</script>
