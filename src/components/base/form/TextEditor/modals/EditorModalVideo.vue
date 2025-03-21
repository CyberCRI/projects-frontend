<template>
  <DialogModal
    :disabled="disabled"
    :confirm-button-label="$t('common.confirm')"
    :cancel-button-label="$t('common.cancel')"
    @close="closeModal"
    @submit="insertVideo"
  >
    <template #header>
      {{ $filters.capitalize($t('file.add-video')) }}
    </template>

    <template #body>
      <TextInput
        v-model="videoSrc"
        :placeholder="$filters.capitalize($t('resource.add-link'))"
        data-test="input-video-link"
        class="text-input"
      />

      <LpiSnackbar type="info" icon="QuestionMark">
        <div v-html="$t('file.add-video-hint')" />
      </LpiSnackbar>
    </template>
  </DialogModal>
</template>

<script>
import DialogModal from '@/components/base/modal/DialogModal.vue'
import LpiSnackbar from '@/components/base/LpiSnackbar.vue'
import TextInput from '@/components/base/form/TextInput.vue'

// TODO: validate video src and display error message
export default {
  name: 'EditorModalVideo',

  components: { DialogModal, LpiSnackbar, TextInput },

  props: {
    editor: {
      type: Object,
      required: true,
    },
  },

  emits: ['closeModal'],

  data() {
    return {
      videoSrc: '',
    }
  },

  computed: {
    validVideo() {
      return this.videoSrc.match(/youtu\.be|youtube|vimeo/)
    },
    disabled() {
      return !this.videoSrc || !this.validVideo
    },
  },

  methods: {
    closeModal() {
      this.$emit('closeModal')
    },

    insertVideo() {
      if (this.validVideo) {
        this.handleVideoModalConfirmed({ src: this.videoSrc })
        this.videoSrc = ''
      }
    },

    handleVideoModalConfirmed(data) {
      this.editor.chain().focus().setExternalVideo({ src: data.src }).run()
      this.closeModal()
    },
  },
}
</script>

<style lang="scss" scoped>
.text-input {
  margin-bottom: $space-l;
}
</style>
