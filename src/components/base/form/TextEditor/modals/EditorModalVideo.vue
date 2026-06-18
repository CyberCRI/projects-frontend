<template>
  <DialogModal
    :disabled="!isValid"
    :confirm-button-label="$t('common.confirm')"
    :cancel-button-label="$t('common.cancel')"
    @close="emit('close')"
    @submit="updateVideo"
  >
    <template #header>
      {{ $t('file.add-video') }}
    </template>

    <template #body>
      <div class="video-preview">
        <iframe v-if="displaySrc" :src="displaySrc" width="440" height="220" frameborder="0" />
      </div>
      <TextInput
        v-model="form.src"
        :label="$t('multieditor.video.label')"
        required
        :help="$t('file.add-video-hint')"
        :placeholder="$t('resource.add-link')"
        data-test="input-video-link"
        class="text-input"
        :errors="errors.src"
      />
    </template>
  </DialogModal>
</template>

<script setup lang="ts">
import { getFormatedVideoSrc } from '~/components/base/form/TextEditor/tiptap-extensions/ExternalVideo'
import DialogModal from '~/components/base/modal/DialogModal.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import { useTipTapVideoForm } from '~/form/tiptap/video'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()

const emit = defineEmits<{
  close: []
}>()

const { form, isValid, errors, cleanedData } = useTipTapVideoForm()

const displaySrc = computed(() => {
  if (cleanedData.value) {
    return getFormatedVideoSrc(cleanedData.value.src)
  }
  return ''
})

const updateVideo = () => {
  props.editor
    .chain()
    .focus()
    .setExternalVideo({ src: cleanedData.value.src, size: 'medium' })
    .run()
  emit('close')
}
</script>

<style lang="scss" scoped>
.video-preview {
  display: flex;
  justify-content: center;
  margin: 1rem;
}
</style>
