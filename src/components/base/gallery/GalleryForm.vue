<template>
  <DialogModal
    :confirm-button-label="$t('common.save')"
    :cancel-button-label="$t('common.cancel')"
    :asyncing="loading"
    :disabled="loading || !isValid"
    :no-second-button="!!status"
    @close="$emit('close')"
    @submit="submit"
  >
    <template #header>
      <h3>
        {{ $t('gallery.add') }}
        <span v-if="form.files?.length" class="gallery-length">({{ form.files.length }})</span>
      </h3>
    </template>

    <template #body>
      <div v-if="images.length" class="gallery-image-editor">
        <GalleryList v-slot="{ image }" :images="images" :editable="!loading">
          <div
            class="pointer-events-none"
            :class="{
              'gallery-uploading': status,
            }"
          >
            <GalleryItem
              :key="image.url"
              :image="image"
              class="gallery-uploading-image"
              :style-img="{ objectFit: 'cover' }"
              :editable="!loading && !status"
              @delete="deleteImage"
            />
            <div v-if="status" class="gallery-uploading-status">
              <LoaderSimple v-if="status.get(image.url) === 'pending'" />
              <IconImage
                v-else-if="status.get(image.url) === 'success'"
                name="Check"
                class="success"
              />
              <IconImage v-else-if="status.get(image.url) === 'error'" name="Close" class="error" />
              <IconImage v-else name="Alert" class="warning" />
            </div>
          </div>
        </GalleryList>
      </div>
      <EmptyLabel v-else :label="$t('gallery.add-picture')" />
    </template>

    <template #extra-buttons>
      <ImageInput v-if="!status" :label="$t('common.add')" multiple @upload-images="uploadImages" />
    </template>
  </DialogModal>
</template>

<script setup lang="ts">
import DialogModal from '@/components/base/modal/DialogModal.vue'
import { useGalleryImageForm } from '@/form/gallery'
import GalleryList from '@/components/base/gallery/GalleryList.vue'
import { ImageGalleryForm } from '@/interfaces/gallery'
import EmptyLabel from '@/components/base/EmptyLabel.vue'
import { urlToImageModel } from '@/functs/imageSizesUtils'
import GalleryItem from '@/components/base/gallery/GalleryItem.vue'
import { AsyncDataRequestStatus } from 'nuxt/app'

const props = withDefaults(
  defineProps<{
    loading?: boolean
    status?: Map<string, AsyncDataRequestStatus>
  }>(),
  {
    loading: false,
    status: null,
  }
)
const emit = defineEmits<{
  close: []
  submit: [ImageGalleryForm]
}>()
const { form, isValid, cleanedData } = useGalleryImageForm()

// create temporary uploaded pictures preview
const images = computed(() => (form.value.files ?? []).map((el) => urlToImageModel(el.url)))

const uploadImages = (pictures: File[]) => {
  const fillers = pictures.map((file) => {
    // optimize to not create new "objectUrl", if is already exists, return exist
    const exists = (form.value.files ?? []).find((el) => el.file === file)
    if (exists) {
      return exists
    }
    return {
      file,
      url: URL.createObjectURL(file),
    }
  })
  form.value.files = fillers
}

// remove "uploaded selected picture"
const deleteImage = (image) => {
  const index = images.value.findIndex((el) => el === image)
  const pictures = form.value.files
  pictures.splice(index, 1)
}

const submit = () => {
  if (props.status) return
  emit('submit', toRaw(cleanedData.value))
}
</script>

<style lang="scss" scoped>
.new-coords {
  text-align: center;
  font-style: italic;
  font-weight: normal;
}

.description-input {
  margin-top: $space-m;
}

.gallery-type-ctn {
  margin: $space-m 0;

  .gallery-type-label {
    font-size: $font-size-s;
    color: $primary-dark;
    font-weight: bold;
    margin-bottom: $space-2xs;
  }
}

.delete-button {
  color: $white;
  border-color: $salmon;
  background: $salmon;
}

.gallery-length {
  font-style: italic;
  opacity: 0.4;
  font-size: small;
}

.gallery-uploading {
  position: relative;

  .gallery-uploading-image {
    opacity: 0.6;
  }

  .gallery-uploading-status {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background-color: color-mix(in srgb, $modal-background, transparent 10%);

    & > * {
      margin: auto;
      width: 25%;

      &.pending {
        fill: $primary-lighter;
      }

      &.success {
        fill: $primary;
      }

      &.error {
        fill: $red;
      }

      &.warning {
        fill: $salmon;
      }
    }
  }
}
</style>

<style>
.gallery-map-ctn .map-recap {
  height: 250px;
}
</style>

<style lang="scss">
.gallery-image-editor {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;

  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);

    > * {
      height: pxToRem(130px);
    }
  }
}
</style>
