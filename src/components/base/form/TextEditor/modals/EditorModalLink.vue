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

<script setup lang="ts">
import DialogModal from '~/components/base/modal/DialogModal.vue'
import LpiButton from '~/components/base/button/LpiButton.vue'
import TextInput from '~/components/base/form/TextInput.vue'

import type { Editor } from '@tiptap/vue-3'
import functions from '~/functs/functions'

const props = defineProps<{ editor: Editor }>()
const emit = defineEmits<{ closeModal: [] }>()

const link = ref(undefined)
const text = ref(undefined)

const linkHref = computed(() => props.editor.getAttributes('link').href)
const hasSelection = computed(() => !props.editor.view.state.selection.empty)
const needText = computed(() => !hasSelection.value && mode.value === 'add')
const mode = computed(() => (linkHref.value !== undefined ? 'edit' : 'add'))
const disabled = computed(() => !link.value || (needText.value && !text.value))

onMounted(() => {
  link.value = linkHref.value
})

const closeModal = () => emit('closeModal')

const handleLinkModalConfirmed = (data) => {
  // set the link if there's data from popup
  if (data) {
    props.editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({
        href: (functions.isValidUrl(data.href) ? '' : 'http://') + data.href,
      })
      .run()
    // if link made from empty selection, add the entered text as content
    if (data.text) {
      const selection = props.editor.view.state.selection
      props.editor
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
    props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
  }

  closeModal()
}

const removeLink = () => handleLinkModalConfirmed(null)
const insertLink = () => {
  const data = {
    href: link.value,
    text: null,
  }
  if (needText.value) {
    data.text = text.value
  }
  handleLinkModalConfirmed(data)
}
</script>

<style lang="scss" scoped>
.button-delete {
  color: var(--white);
  background: var(--salmon);
}

label {
  display: block;
  font-weight: 400;
  font-size: $font-size-l;
  padding: $space-m 0;
}
</style>
