<script setup lang="ts">
import DialogModal from '~/components/base/modal/DialogModal.vue'
import LpiButton from '~/components/base/button/LpiButton.vue'
import TextInput from '~/components/base/form/TextInput.vue'

import { useTipTapLinkForm } from '~/form/tiptap/links'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor }>()
const emit = defineEmits<{ close: [] }>()

const mode = ref<'edit' | 'add'>('add')

const { form, isValid, cleanedData, errors, reset } = useTipTapLinkForm(mode)

const updateLink = () => {
  const data = cleanedData.value

  props.editor
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({
      href: data.href,
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
  emit('close')
}

const deleteLink = () => {
  props.editor.chain().focus().extendMarkRange('link').deleteSelection().run()
  emit('close')
}

onMounted(() => {
  const href = props.editor.getAttributes('link').href
  const { to, from } = props.editor.view.state.selection
  const text = props.editor.state.doc.textBetween(from, to)

  mode.value = href ? 'edit' : 'add'

  reset({
    href,
    text,
  })
})
</script>

<template>
  <DialogModal
    :confirm-button-label="mode === 'add' ? $t('common.add') : $t('common.edit')"
    :cancel-button-label="$t('common.cancel')"
    :disabled="!isValid"
    @close="emit('close')"
    @submit="updateLink"
  >
    <template #header>
      {{ mode === 'add' ? $t('resource.add-link') : $t('resource.edit-link') }}
    </template>

    <template #body>
      <div class="list-container">
        <TextInput
          v-if="mode === 'add'"
          v-model="form.text"
          :label="$t('resource.add-link-text-label')"
          required
          :placeholder="$t('resource.add-link-text')"
          data-test="input-new-link-text"
          :errors="errors.text"
        />

        <TextInput
          v-model="form.href"
          :label="$t('resource.add-link-url-label')"
          required
          :placeholder="$t('resource.add-link-url')"
          data-test="input-new-link"
          :errors="errors.href"
        />
      </div>
    </template>

    <template #extra-buttons>
      <LpiButton
        v-if="mode === 'edit'"
        class="button-footer button-delete"
        aria-label="delete-button"
        data-test="delete-link-button"
        :label="$t('common.delete')"
        @click="deleteLink"
      />
    </template>
  </DialogModal>
</template>

<style lang="scss" scoped>
.button-delete {
  color: var(--white);
  background: var(--salmon);
}
</style>
