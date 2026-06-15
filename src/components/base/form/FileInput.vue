<template>
  <div class="file-input-ctn">
    <label ref="label" :for="uniqueId" class="file-button" data-test="upload-file-button">
      <LpiButton btn-icon="Upload" :label="label" @click.prevent="labelRef.click()" />
    </label>
    <span v-if="files?.length">
      {{
        Array.from(files)
          .map((f: { name: string }) => `"${f.name}"`)
          .join(', ')
      }}
    </span>
    <input
      :id="uniqueId"
      ref="fileInput"
      type="file"
      :accept="fileTypes"
      :multiple="multiple"
      @change="$emit('update:modelValue', ($event.target as any).files || [])"
    />

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useUniqueId } from '~/composables/useUniqueId'

const props = withDefaults(
  defineProps<{
    label?: string
    maxSizeMb?: number
    fileTypes?: string
    multiple?: boolean
    errorMessage?: string | null
    required?: boolean
  }>(),
  {
    isLink: false,
    maxSizeMb: 2.25,
    fileTypes: '*/*',
    multiple: false,
    errorMessage: null,
    required: false,
    label: '',
  }
)

const files = defineModel({ type: [Array, null], required: true })

const uniqueId = useUniqueId()
const labelRef = useTemplateRef('label')
</script>

<style lang="scss" scoped>
.file-input-ctn {
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
