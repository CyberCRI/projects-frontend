<template>
  <div
    class="img-inner"
    :class="{ 'round-picture': roundPicture }"
    :style="{ '--picture-ratio': pictureRatio }"
  >
    <div class="img-preview">
      <div class="preview-wrapper-outer" :class="{ active: !disabled }">
        <CroppedImage
          :alt="pictureAlt"
          :contain="true"
          :image-sizes="imageSizes"
          :src="displayedImage"
          class="preview-wrapper-inner"
          :ratio="pictureRatio"
          @click="imageOnClick"
        />
      </div>
    </div>
    <div class="img-actions">
      <LpiButton
        v-if="defaultPictureFiles?.length > 1"
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
        @upload-image="uploadImage"
      />

      <LpiButton
        v-if="!noResize"
        v-disable-focus="disabled"
        :label="$t('project.form.resize-image')"
        btn-icon="CropFree"
        data-test="resize-image-button"
        @click="openImageResizer"
      />
    </div>
    <!-- image resizer -->
    <BaseDrawer
      :confirm-action-name="$t('common.confirm')"
      :is-opened="showImageResizer"
      :title="$t('project.form.resize-image')"
      class="medium"
      data-test="image-resizer-drawer"
      @close="showImageResizer = false"
      @confirm="saveImageSizes"
    >
      <LazyImageResizer
        v-if="showImageResizer"
        ref="imageResizer"
        :image="displayedImage"
        :image-sizes="imageSizes"
        :round-shape="roundPicture"
        :ratio="pictureRatio"
        @invalid-image-size="showImageResizer = false"
      />
    </BaseDrawer>
  </div>
</template>
<script>
import { LazyImageResizer } from '#components'
import CroppedImage from '@/components/base/media/CroppedImage.vue'
import ImageInput from '@/components/base/form/ImageInput.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
export default {
  name: 'ImageEditor',

  components: { CroppedImage, LazyImageResizer, ImageInput, BaseDrawer },

  props: {
    imageSizes: {
      type: [Object, null],
      required: true,
    },

    picture: {
      type: [Object, File, null],
      required: true,
    },
    defaultPicture: {
      type: [String, Array],
      required: false,
      default: '',
    },
    pictureAlt: {
      type: String,
      required: false,
      default: 'Image',
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    roundPicture: {
      type: Boolean,
      required: false,
      default: false,
    },

    pictureRatio: {
      type: Number,
      required: false,
      default: 1,
    },
    noResize: {
      type: Boolean,
      default: false,
    },

    dontResizeOnChange: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:imageSizes', 'update:picture'],

  data() {
    return {
      showImageResizer: false,
      defaultPictureFiles: [],
      defaultPictureIndex: 0,
      displayableImage: '',
      isOnClient: false,
    }
  },

  computed: {
    displayedImage() {
      return this.picture instanceof File
        ? this.displayableImage
        : this.picture?.variations?.small || null
    },
  },

  async mounted() {
    const urlArray = Array.isArray(this.defaultPicture)
      ? this.defaultPicture
      : [this.defaultPicture]

    this.defaultPictureFiles = await Promise.all(urlArray.map(this.getFilesFromUrl))

    if (!this.picture && this.defaultPictureFiles.length) {
      this.setImage(this.defaultPictureFiles[0])
    }
  },

  methods: {
    async getFilesFromUrl(url) {
      const filename = url.split('/').pop() || 'default-image'
      const result = await $fetch(url, { responseType: 'blob' }) // TODO nuxt check this
      return new File([result], filename)
    },

    setImage(image) {
      this.displayableImage = ''
      const fileReader = new FileReader()
      fileReader.readAsDataURL(image)
      fileReader.onload = (fileReaderEvent) => {
        this.displayableImage = fileReaderEvent.target.result
      }

      this.$emit('update:picture', image)
      // reinit image cropping data
      // weird bug : cant emits several event in the same tick
      this.$nextTick(() => {
        this.$emit('update:imageSizes', null)
      })
    },

    uploadImage(image) {
      this.setImage(image)
      if (!this.noResize && !this.dontResizeOnChange) this.$nextTick(this.openImageResizer)
    },

    openImageResizer() {
      this.showImageResizer = true
    },

    saveImageSizes() {
      this.$emit('update:imageSizes', {
        scaleX: this.$refs.imageResizer.scaleX,
        scaleY: this.$refs.imageResizer.scaleY,
        left: this.$refs.imageResizer.left,
        top: this.$refs.imageResizer.top,
        naturalRatio: this.$refs.imageResizer.naturalRatio,
      })
      this.showImageResizer = false
    },

    nextDefaultPicture() {
      if (this.defaultPictureFiles.length) {
        this.defaultPictureIndex = (this.defaultPictureIndex + 1) % this.defaultPictureFiles.length
        this.setImage(this.defaultPictureFiles[this.defaultPictureIndex])
      }
    },
    imageOnClick() {
      if (!this.disabled) this.$refs.imageInput?.$refs?.header_image?.click()
    },
  },
}
</script>
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
    border: $border-width-s solid $primary;
    background-color: $white;
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
