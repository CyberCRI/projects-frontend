<template>
  <div class="image-input-ctn">
    <label ref="label" :for="uniqueId" class="image-button" data-test="upload-image-button">
      <LinkButton
        v-if="isLink"
        v-disable-focus="unfocusable"
        btn-icon="Upload"
        :label="displayedLabel"
        @click.prevent="labelRef.click()"
      />

      <LpiButton
        v-else
        v-disable-focus="unfocusable"
        btn-icon="Upload"
        :label="displayedLabel"
        @click.prevent="labelRef.click()"
      />
    </label>

    <input
      :id="uniqueId"
      ref="fileInput"
      type="file"
      :accept="fileTypes"
      :multiple="multiple"
      @change="uploadImage"
    />
    <p v-if="fileIsTooLarge" class="error-message">
      {{ $t('common.file-too-big', { maxSize: maxSizeMb }) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import LpiButton from '@/components/base/button/LpiButton.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import { useUniqueId } from '@/composables/useUniqueId'

const props = withDefaults(
  defineProps<{
    existingImage?: string
    unfocusable?: boolean
    label?: string
    isLink?: boolean
    maxSizeMb?: number
    fileTypes?: string
    multiple?: boolean
  }>(),
  {
    existingImage: null,
    unfocusable: false,
    label: null,
    isLink: false,
    maxSizeMb: 2.25,
    fileTypes: 'image/*',
    multiple: false,
  }
)

const emit = defineEmits<{
  'upload-image': [File]
  'upload-images': [File[]]
}>()

const uniqueId = useUniqueId()

const displayedLabel = computed(() => {
  if (props.label) {
    return props.label
  }
  if (props.existingImage) {
    return $t('picture.change-picture')
  }
  return $t('picture.add-picture')
})

const labelRef = useTemplateRef('label')
const inputRef = useTemplateRef('fileInput')
const fileIsTooLarge = ref(false)

const isFileMaxSize = (file: File) => {
  return props.maxSizeMb && file.size > Math.round(props.maxSizeMb * 1024 * 1024)
}

const uploadImage = (event) => {
  const files: File[] = []

  Array.from(inputRef.value.files).forEach((item) => {
    if (isFileMaxSize(item)) {
      fileIsTooLarge.value = true
    } else {
      files.push(item)
    }
  })

  if (files.length) {
    if (props.multiple) {
      emit('upload-images', files)
    } else {
      emit('upload-image', files[0])
    }
  }
  event.target.value = ''
}
</script>

<style lang="scss" scoped>
.image-input-ctn {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 1rem;

  input[type='file'] {
    display: none;
  }

  label {
    cursor: pointer;
  }

  .error-message {
    color: $salmon;
    font-weight: bold;
  }
}
</style>
