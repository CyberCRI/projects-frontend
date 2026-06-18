<template>
  <DialogModal
    :confirm-button-label="$t('common.confirm')"
    :cancel-button-label="$t('common.cancel')"
    :disabled="!isValid"
    :asyncing="asyncing"
    @close="emit('close')"
    @submit="insertImage"
  >
    <template #header>
      {{ $t('file.add-image') }}
    </template>

    <template #body>
      <div class="list-container">
        <GalleryItem
          v-if="displayedImage"
          class="image-preview"
          :image="displayedImage"
          editable
          @delete="form.file = null"
        />

        <ImageInput
          id="editor-image"
          :label="$t('resource.upload-image')"
          class="image-input"
          :errors="errors.file"
          :max-size-mb="Infinity"
          @upload-image="form.file = $event"
        />
      </div>
    </template>
  </DialogModal>
</template>

<script setup lang="ts">
import DialogModal from '~/components/base/modal/DialogModal.vue'
import ImageInput from '~/components/base/form/ImageInput.vue'

import useToasterStore from '~/stores/useToaster'

import type { ImageModealCreated, ImageModel } from '~/models/image.model'
import GalleryItem from '~/components/base/gallery/GalleryItem.vue'
import { fileToImageModel } from '~/functs/imageSizesUtils'
import { useTipTapImageForm } from '~/form/tiptap/image'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  // function must take a file argument and return a promise resolving to an {url, width, height} object
  saveImageCallback: (file: File) => Promise<ImageModealCreated>
  editor: Editor
}>()

const emit = defineEmits<{
  close: []
  image: [ImageModel]
}>()

const { t } = useNuxtI18n()
const toaster = useToasterStore()
const asyncing = ref(false)

const { form, isValid, errors, cleanedData } = useTipTapImageForm()

const displayedImage = computed(() => {
  if (cleanedData.value?.file) {
    return fileToImageModel(cleanedData.value.file)
  }
  return null
})

const addImageToEditor = (img: ImageModealCreated) => {
  const MAX_SIZE = 1100
  const width = img.width < MAX_SIZE ? img.width : MAX_SIZE
  const height = img.height < MAX_SIZE ? img.height : img.height * (MAX_SIZE / img.width)

  props.editor
    .chain()
    .focus()
    .setImage({
      src: img.static_url,
      size: 'small',
      width,
      height,
    })
    .run()
}

const insertImage = () => {
  asyncing.value = true
  return props
    .saveImageCallback(cleanedData.value.file)
    .then((image) => {
      addImageToEditor(image)
      nextTick(() => {
        emit('image', image)
        emit('close')
      })
    })
    .catch(() => toaster.pushError(t('resource.error-asyncing-image')))
    .finally(() => (asyncing.value = false))
}
</script>

<style lang="scss" scoped>
.image-preview {
  width: fit-content;
  margin: auto;
  height: 400px;
}

.image-input {
  margin: 0 auto;
}
</style>
