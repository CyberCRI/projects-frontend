<template>
  <DialogModal
    :disabled="disabled"
    :confirm-button-label="$t('common.confirm')"
    :cancel-button-label="$t('common.cancel')"
    @close="closeModal"
    @submit="insertVideo"
  >
    <template #header>
      {{ $t('file.add-video') }}
    </template>

    <template #body>
      <TextInput
        v-model="videoSrc"
        :placeholder="$t('resource.add-link')"
        data-test="input-video-link"
        class="text-input"
      />

      <LpiSnackbar type="info" icon="QuestionMark">
        <div v-html="$t('file.add-video-hint')" />
      </LpiSnackbar>
    </template>
  </DialogModal>
</template>

<script setup lang="ts">
import DialogModal from '~/components/base/modal/DialogModal.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import LpiSnackbar from '~/components/base/LpiSnackbar.vue'
import type { Editor } from '@tiptap/core'

// TODO: validate video src and display error message

const props = defineProps<{
  editor: Editor
}>()

const emit = defineEmits<{
  closeModal: []
}>()

const videoSrc = ref('')

const validVideo = computed(() => {
  return videoSrc.value.match(/youtu\.be|youtube|vimeo/)
})
const disabled = computed(() => {
  return !videoSrc.value || !validVideo.value
})

const closeModal = () => emit('closeModal')

const handleVideoModalConfirmed = (data) => {
  // @ts-expect-error 'setExternalVideo' is set in extetions (from ExternalVideo.ts)
  props.editor.chain().focus().setExternalVideo({ src: data.src }).run()
  closeModal()
}

const insertVideo = () => {
  if (validVideo.value) {
    handleVideoModalConfirmed({ src: videoSrc.value })
    videoSrc.value = ''
  }
}
</script>

<style lang="scss" scoped>
.text-input {
  margin-bottom: $space-l;
}
</style>
