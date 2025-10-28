<template>
  <DialogModal
    :confirm-button-label="mode === 'add' ? $t('common.add') : $t('common.edit')"
    :cancel-button-label="$t('common.cancel')"
    :disabled="disabled"
    @close="closeModal"
    @submit="insertLink"
  >
    <template #header>
      {{ mode === 'add' ? $t('resource.add-link') : $t('resource.edit-link') }}
    </template>

    <template #body>
      <template v-if="needText">
        <label>{{ $t('resource.add-link-text-label') }}</label>
        <TextInput
          v-model="text"
          :placeholder="$t('resource.add-link-text')"
          data-test="input-new-link-text"
        />
      </template>
      <label>{{ $t('resource.add-link-url-label') }}</label>
      <TextInput
        v-model="link"
        :placeholder="$t('resource.add-link-url')"
        data-test="input-new-link"
      />
    </template>

    <template #extra-buttons>
      <LpiButton
        v-if="mode === 'edit'"
        class="button-footer button-delete"
        aria-label="delete-button"
        data-test="delete-link-button"
        :label="$t('common.delete')"
        @click="removeLink"
      />
    </template>
  </DialogModal>
</template>

<script>
import DialogModal from '@/components/base/modal/DialogModal.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import funct from '@/functs/functions.ts'
import LpiButton from '@/components/base/button/LpiButton.vue'

export default {
  name: 'EditorModalLink',

  components: { DialogModal, TextInput, LpiButton },

  props: {
    editor: { type: Object, required: true },
  },

  emits: ['closeModal'],

  data() {
    return {
      link: undefined,
      text: undefined,
    }
  },

  computed: {
    needText() {
      return !this.hasSelection && this.mode === 'add'
    },
    mode() {
      return this.linkHref !== undefined ? 'edit' : 'add'
    },
    disabled() {
      return !this.link || (this.needText && !this.text)
    },
    linkHref() {
      return this.editor.getAttributes('link').href
    },
    hasSelection() {
      return !this.editor.view.state.selection.empty
    },
  },

  mounted() {
    this.link = this.linkHref
  },

  methods: {
    closeModal() {
      this.$emit('closeModal')
    },

    insertLink() {
      const data = {
        href: this.link,
      }
      if (this.needText) {
        data.text = this.text
      }
      this.handleLinkModalConfirmed(data)
    },

    removeLink() {
      this.handleLinkModalConfirmed(null)
    },

    handleLinkModalConfirmed(data) {
      // set the link if there's data from popup
      if (data) {
        this.editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({
            href: (funct.isValidUrl(data.href) ? '' : 'http://') + data.href,
          })
          .run()
        // if link made from empty selection, add the entered text as content
        if (data.text) {
          const selection = this.editor.view.state.selection
          this.editor
            .chain()
            .focus()
            .insertContentAt(
              {
                from: selection.from,
                to: selection.to,
              },
              data.text
            )
            .run()
        }
      } else {
        // if there is no data, unset the link
        this.editor.chain().focus().extendMarkRange('link').unsetLink().run()
      }

      this.closeModal()
    },
  },
}
</script>

<style lang="scss" scoped>
.button-delete {
  color: $white;
  background: $salmon;
}

label {
  display: block;
  font-weight: 400;
  font-size: $font-size-l;
  padding: $space-m 0;
}
</style>
