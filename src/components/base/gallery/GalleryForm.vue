<template>
  <DialogModal
    :confirm-button-label="$t('common.save')"
    :cancel-button-label="$t('common.cancel')"
    :asyncing="loading"
    :disabled="loading || !isValid"
    @close="$emit('close')"
    @submit="$emit('submit')"
  >
    <template #header>
      <h3>
        {{ $t('gallery.add') }}
        <span v-if="form.pictures?.length" class="gallery-length">
          ({{ form.pictures.length }})
        </span>
      </h3>
    </template>

    <template #body>
      <div v-if="images.length" class="gallery-image-editor">
        <GalleryList :images="images" editable @delete="deleteImage" />
      </div>
      <div v-else class="gallery-empty">
        {{ $t('gallery.add-picture') }}
      </div>
    </template>

    <template #extra-buttons>
      <ImageInput :label="$t('common.add')" multiple @upload-images="uploadImages" />
    </template>
  </DialogModal>
</template>

<script setup lang="ts">
import DialogModal from '@/components/base/modal/DialogModal.vue'
import { useGalleryImageForm } from '@/form/gallery'
import GalleryList from '@/components/base/gallery/GalleryList.vue'
import { ImageGallery } from '@/interfaces/gallery'

withDefaults(
  defineProps<{
    loading?: boolean
  }>(),
  {
    loading: false,
  }
)
defineEmits(['submit', 'close', 'delete'])

const { form, isValid } = useGalleryImageForm()

// create temporary uploaded pictures preview
const images = computed(() => {
  const img: ImageGallery[] = []
  const files = form.value.pictures ?? []

  files.forEach((image) => {
    img.push({
      alt: '',
      src: URL.createObjectURL(image),
    } as ImageGallery)
  })
  return img
})

const uploadImages = (pictures: File[]) => (form.value.pictures = pictures)

// remove "uploaded selected picture"
const deleteImage = (image) => {
  const index = images.value.findIndex((el) => el === image)
  const pictures = form.value.pictures
  pictures.splice(index, 1)
  form.value.pictures = [...pictures]
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

.gallery-empty {
  text-align: center;
  font-style: italic;
  opacity: 0.5;
}

.gallery-length {
  font-style: italic;
  opacity: 0.4;
  font-size: small;
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
