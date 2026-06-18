<script setup lang="ts">
import type { ImageSizes } from '~/functs/imageSizesUtils'
import 'croppr/dist/croppr.css'
import Croppr from 'croppr'

const props = withDefaults(
  defineProps<{
    imageSizes?: ImageSizes
    image?: string
    // is crop area a circle
    roundShape?: boolean
    // crop area aspect ratio
    ratio?: number
  }>(),
  {
    imageSizes: null,
    image: null,
    roundShape: false,
    ratio: 1,
  }
)

const emit = defineEmits<{
  'invalid-image-size': []
}>()

const imageContainerRef = useTemplateRef('imageContainer')
const x = ref(0)
const y = ref(0)
const width = ref(0)
const height = ref(0)
const naturalWidth = ref(0)
const naturalHeight = ref(0)
const maxWidth = ref(0)
const maxHeight = ref(0)
const left = ref(0)
const top = ref(0)
const scaleX = ref(1)
const scaleY = ref(1)
const naturalRatio = ref(1)
const croppr = ref(null)
const bboxWidth = ref(0)
const bboxHeight = ref(0)
const bboxScale = ref(1)

const init = () => {
  // get image natural size and aspect ratio
  const img = imageContainerRef.value.querySelector<HTMLImageElement>('.cropper-image')
  naturalWidth.value = img.naturalWidth
  naturalHeight.value = img.naturalHeight
  if (!naturalWidth.value || !naturalHeight.value) {
    emit('invalid-image-size')
  }
  naturalRatio.value = img.naturalWidth / naturalHeight.value

  // get container aspect ratio
  // so we can fit croppr to availabe space
  const containerBbox = imageContainerRef.value.getBoundingClientRect()
  const containerRatio = containerBbox.width / containerBbox.height

  // set a limit on width or height
  // according to image and container ratio
  // this must be done with js or croppr gets lost on vertical pictures
  if (naturalRatio.value >= containerRatio) {
    imageContainerRef.value.classList.remove('limit-height')
    imageContainerRef.value.classList.add('limit-width')
  } else {
    imageContainerRef.value.classList.remove('limit-width')
    imageContainerRef.value.classList.add('limit-height')
  }

  // get image bounding box size and scale from natural size
  // because croppr data are in natural sizes
  const bbox = img.getBoundingClientRect()
  bboxWidth.value = bbox.width
  bboxHeight.value = bbox.height
  bboxScale.value = bboxWidth.value / naturalWidth.value

  // again croppr gets lost on vertical pictures
  // and we cant set this via js because croppr is not yet initialized and after it is too late
  // so hack this with css custom properties
  imageContainerRef.value.style.setProperty('--croppr-width', `${bboxWidth.value}px`)
  imageContainerRef.value.style.setProperty('--croppr-height', `${bboxHeight.value}px`)

  // set maximum cropping area accordiang to aspect crop ratio
  maxWidth.value = bboxWidth.value
  maxHeight.value = bboxHeight.value
  if (naturalRatio.value > props.ratio) {
    maxWidth.value = bboxHeight.value * props.ratio
  } else {
    maxHeight.value = bboxWidth.value / props.ratio
  }

  // default croping area to max size and centered
  if (!props.imageSizes) {
    x.value = (bboxWidth.value - maxWidth.value) / 2 // pixel position, centered
    y.value = (bboxHeight.value - maxHeight.value) / 2 // pixel position, centered
    width.value = maxWidth.value // pixel size
    height.value = maxHeight.value // pixel size
    // or use the given croping area
  } else {
    // positon is negated because trandform is reciprocal in croppr and in image display
    // i.e. in cropper we move and scale the crop area
    // and in showing image we scale and move the image
    x.value = -bboxWidth.value * (props.imageSizes.left / 100) // percentage to pixel size
    y.value = -bboxHeight.value * (props.imageSizes.top / 100) // percentage to pixel size

    if ((props.ratio || 1) > naturalRatio.value) {
      width.value = bboxWidth.value / props.imageSizes.scaleX // ratio to pixel size
      height.value = width.value / (props.ratio || 1) // ratio to pixel size
    } else {
      height.value = bboxHeight.value / props.imageSizes.scaleY // ratio to pixel size
      width.value = height.value * (props.ratio || 1) // ratio to pixel size
    }
  }

  // init croppr
  const cropCircle = props.roundShape
    ? (data) => {
        const x = (bboxWidth.value * (data.x + data.width / 2)) / naturalWidth.value
        const y = (bboxHeight.value * (data.y + data.height / 2)) / naturalHeight.value
        // strangely it is always bboxHeight that works
        const radius = (bboxHeight.value * data.width) / 2 / naturalHeight.value
        const imageClipped =
          imageContainerRef.value.querySelector<HTMLElement>('.croppr-imageClipped')
        if (imageClipped) imageClipped.style.clipPath = `circle(${radius}px at ${x}px ${y}px)`
      }
    : () => {}

  croppr.value = new Croppr(img, {
    aspectRatio: props.ratio ? 1 / props.ratio : 1,
    onCropEnd: (data) => {
      updateData(data)
      cropCircle(data)
    },
    onCropMove: (data) => {
      cropCircle(data)
    },
    onInitialize: (instance) => {
      // set initial cropping area (order of op matters !)
      instance.moveTo(x.value, y.value).resizeTo(width.value, height.value, [
        0, // transform origin is top left
        0,
      ])
      // timeout seem to fix bug where y and height are NaN
      setTimeout(() => {
        const data = instance.getValue()
        cropCircle(data)
        updateData(instance.getValue())
      }, 1)
    },
    minSize: [1, 1, '%'],
  })
}

const updateData = (data) => {
  if (isNaN(data.x) || isNaN(data.y) || isNaN(data.width) || isNaN(data.height)) return
  // memoize the data so it can be acesses from parent comoponent
  // data need to be scaled according to the image display size (ie natural vs bbox)

  const scale =
    (props.ratio || 1) > naturalRatio.value
      ? naturalWidth.value / data.width
      : naturalHeight.value / data.height
  if (!isFinite(scale)) return

  left.value = (-100 * data.x) / naturalWidth.value // percentage, negated for recriprocal transformation
  top.value = (-100 * data.y) / naturalHeight.value // percentage, negated for recriprocal transformation

  scaleX.value = scale
  scaleY.value = scale
}

const imageSizesExposed = computed(() => {
  return {
    scaleX: scaleX.value,
    scaleY: scaleY.value,
    left: left.value,
    top: top.value,
    naturalRatio: naturalRatio.value,
  } satisfies ImageSizes
})
defineExpose({
  imageSizes: imageSizesExposed,
})

onResize(() => {
  // reinit croppr on resize
  // because resize invalidate all size data
  croppr.value.destroy()
  init()
})
</script>

<template>
  <div ref="imageContainer" class="image-resizer">
    <img :src="image" alt="" class="cropper-image" @load="init" />
  </div>
</template>

<style lang="scss" scoped>
.image-resizer {
  flex-grow: 1;
  max-height: 100%;
  max-width: 100%;

  img {
    max-width: 100%;
    max-height: 100%;
    display: block;
    height: auto;
    width: auto;
    object-fit: cover;
  }

  &.limit-width img {
    width: 100%;
  }

  &.limit-height img {
    height: 100%;
  }
}

:deep(.croppr),
:deep(.croppr-container) {
  width: 100%;
  height: 100%;
}

:deep(img),
:deep(.croppr-container img) {
  width: 100%;
  display: block;
  max-width: 100%;
}

.limit-width {
  :deep(.croppr) {
    height: var(--croppr-height); // set in init()
  }

  :deep(img),
  :deep(.croppr-container img) {
    width: 100%;
    height: auto;
  }
}

.limit-height {
  :deep(.croppr) {
    width: var(--croppr-width); // set in init()
  }

  .limit-height :deep(img),
  .limit-height :deep(.croppr-container img) {
    height: 100%;
    width: auto;
  }
}
</style>
