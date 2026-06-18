<script setup lang="ts">
import CroppedImage from '~/components/base/media/CroppedImage.vue'
import ImageInput from '~/components/base/form/ImageInput.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import { usePublicURL } from '~/composables/usePublic'

import { fileToImageModel, type ImageSizes } from '~/functs/imageSizesUtils'
import type { ImageModel, ImageVariations } from '~/models/image.model'
import { getFileFromURL } from '~/api/utils.service'

const { t } = useNuxtI18n()

const props = withDefaults(
  defineProps<{
    imageSizes?: ImageSizes
    picture?: File | ImageModel
    defaultPicture: string | string[]
    pictureAlt?: string
    disabled?: boolean
    roundPicture?: boolean
    pictureRatio?: number

    noResize?: boolean
    maxSizeMb?: number
    variation?: ImageVariations
    dontResizeOnChange?: boolean
  }>(),
  {
    imageSizes: null,
    picture: null,
    pictureAlt: null,
    disabled: false,
    roundPicture: false,
    pictureRatio: 1,
    noResize: false,
    maxSizeMb: null,
    variation: 'large',
    dontResizeOnChange: false,
  }
)

const emit = defineEmits<{
  'update:imageSizes': [ImageSizes]
  'update:picture': [File]
}>()

const { stateModals, openModals, closeModals } = useModals({ resizer: false })

// add prefix on all urls
const defaultPictureURL = computed(() => {
  return (Array.isArray(props.defaultPicture) ? props.defaultPicture : [props.defaultPicture]).map(
    (url) => usePublicURL(url)
  )
})

const defaultPictureIndex = ref(0)

const displayedImage = computed(() => {
  let image: ImageModel
  if (props.picture instanceof File) {
    image = fileToImageModel(props.picture)
  } else {
    image = props.picture
  }

  if (props.imageSizes) {
    return {
      ...image,
      ...props.imageSizes,
    }
  }
  return image
})

const setImage = (image: File) => {
  emit('update:picture', image)
  // reinit image cropping data
  // weird bug : cant emits several event in the same tick
  nextTick(() => emit('update:imageSizes', null))
}

const onUploadImage = (image) => {
  setImage(image)
  if (!props.noResize && !props.dontResizeOnChange) {
    openModals('resizer')
  }
}

const imageResizerRef = useTemplateRef('imageResizer')
const saveImageSizes = () => {
  if (imageResizerRef.value) {
    emit('update:imageSizes', imageResizerRef.value.imageSizes)
  }
  closeModals('resizer')
}

const nextDefaultPicture = async () => {
  if (defaultPictureURL.value.length) {
    defaultPictureIndex.value = (defaultPictureIndex.value + 1) % defaultPictureURL.value.length
    setImage(await getFileFromURL(defaultPictureURL.value[defaultPictureIndex.value]))
  }
}

// safe check image (if not set, set first default pictures)
watchEffect(async () => {
  if (!props.picture) {
    setImage(await getFileFromURL(defaultPictureURL.value[0]))
  }
})
</script>

<template>
  <div
    class="img-inner"
    :class="{ 'round-picture': roundPicture }"
    :style="{ '--picture-ratio': pictureRatio }"
  >
    <div class="img-preview">
      <div class="preview-wrapper-outer" :class="{ active: !disabled }">
        <CroppedImage
          :alt="pictureAlt || t('common.image')"
          :contain="true"
          :image-sizes="imageSizes"
          :src="displayedImage?.variations?.[variation]"
          class="preview-wrapper-inner"
          :ratio="pictureRatio"
          @click="!disabled && openModals('resizer')"
        />
      </div>
    </div>
    <div class="img-actions">
      <LpiButton
        v-if="defaultPictureURL?.length > 1"
        v-disable-focus="disabled"
        :label="$t('project.random-image')"
        btn-icon="RotateRight"
        data-test="random-image-button"
        @click="nextDefaultPicture"
      />

      <ImageInput
        id="header_image"
        ref="imageInput"
        :unfocusable="disabled"
        :label="$t('common.modify')"
        :max-size-mb="maxSizeMb"
        @upload-image="onUploadImage"
      />

      <LpiButton
        v-if="!noResize"
        v-disable-focus="disabled"
        :label="$t('project.form.resize-image')"
        btn-icon="CropFree"
        data-test="resize-image-button"
        @click="openModals('resizer')"
      />
    </div>
    <!-- image resizer -->
    <BaseDrawer
      :confirm-action-name="$t('common.confirm')"
      :is-opened="stateModals.resizer"
      :title="$t('project.form.resize-image')"
      class="medium"
      data-test="image-resizer-drawer"
      @close="closeModals('resizer')"
      @confirm="saveImageSizes"
    >
      <LazyImageResizer
        v-if="stateModals.resizer"
        ref="imageResizer"
        :image="displayedImage.variations.large"
        :image-sizes="imageSizes"
        :round-shape="roundPicture"
        :ratio="pictureRatio"
        @invalid-image-size="closeModals('resizer')"
      />
    </BaseDrawer>
  </div>
</template>

<style lang="scss" scoped>
.img-inner {
  width: 100%;
  display: flex;
  align-items: center;
  gap: $space-m;

  .img-preview,
  .img-actions {
    flex-basis: 50%;
    flex-grow: 1;
  }

  .img-actions {
    display: flex;
    flex-flow: column;
    gap: $space-m;
    justify-content: center;
    align-items: flex-start;
  }

  .img-preview {
    border: $border-width-s solid var(--primary);
    background-color: var(--white);
    overflow: hidden;
  }

  &.round-picture .img-preview {
    border-radius: 100%;
  }
}

.preview-wrapper-outer {
  width: 100%;
  padding-bottom: calc(100% / var(--picture-ratio, 1));
  position: relative;

  &.active {
    cursor: pointer;
  }
}

.preview-wrapper-inner {
  position: absolute;
  inset: 0;
}
</style>
