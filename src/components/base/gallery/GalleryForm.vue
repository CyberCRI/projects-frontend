<template>
  <DialogModal
    :confirm-button-label="$t('common.save')"
    :cancel-button-label="$t('common.cancel')"
    :asyncing="loading"
    :disabled="loading || !isValid"
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
          <div class="pointer-events-none gallery-uploading">
            <GalleryItem
              :key="image.url"
              :image="image"
              class="gallery-uploading-image"
              :style-img="{ objectFit: 'cover' }"
              :editable="!loading"
              @delete="deleteImage"
            />
            <div v-if="status" class="gallery-uploading-status">
              <LoaderSimple v-if="status[image.file] === 'pending'" />
              <!-- <IconImage v-if="image.status === 'pending'" name="Circle" class="pending" /> -->
              <IconImage
                v-else-if="status[image.file] === 'success'"
                name="Check"
                class="success"
              />
              <IconImage v-else-if="status[image.file] === 'error'" name="Close" class="error" />
              <IconImage v-else name="Alert" class="warning" />
            </div>
          </div>
        </GalleryList>
      </div>
      <EmptyLabel v-else :label="$t('gallery.add-picture')" />
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
import { ImageGalleryForm } from '@/interfaces/gallery'
import EmptyLabel from '@/components/base/EmptyLabel.vue'
import { ImageModel } from '@/models/image.model'
import { fileToImageModel } from '@/functs/imageSizesUtils'
import GalleryItem from '@/components/base/gallery/GalleryItem.vue'

withDefaults(
  defineProps<{
    loading?: boolean
    status?: any
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
const images = computed(() => {
  const files = form.value.files ?? []
  return files.map((file) => fileToImageModel(file))
})

const uploadImages = (pictures: File[]) => (form.value.files = pictures)

// remove "uploaded selected picture"
const deleteImage = (image) => {
  const index = images.value.findIndex((el) => el === image)
  const pictures = form.value.files
  pictures.splice(index, 1)
  // form.value.files = [...pictures]
}

const submit = () => {
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
