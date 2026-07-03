<script setup lang="ts">
import TipTapEditorContainer from '@/components/base/form/TextEditor/TipTapEditorContainer.vue'
import type TipTapEditorMenus from '~/components/base/form/TextEditor/TipTapEditorMenus.vue'
import TipTapEditorContent from '@/components/base/form/TextEditor/TipTapEditorContent.vue'
import { PropsDefault, emitsDefinitions, useTipTap } from '~/composables/tiptap'
import type { PropsDefinitions } from '~/composables/tiptap'

const { t } = useNuxtI18n()

// events
const emit = defineEmits(emitsDefinitions)

// props
const props = withDefaults(defineProps<PropsDefinitions>(), PropsDefault)

const { editor, onDrop, onBlur, resetContent, appendTranslationsStyle, initEditor, destroyEditor } =
  useTipTap({
    props,
    emit,
    t,
    extraOptions: {
      onBlur: (...args) => {
        emit('blur', ...args)
      },
    },
  })

// lifecycle
onMounted(() => {
  appendTranslationsStyle()
  initEditor()
})

onBeforeUnmount(() => {
  destroyEditor()
})

// expose
defineExpose({
  editor,
  resetContent,
})
</script>

<template>
  <TipTapEditorContainer v-if="editor" :editor="editor" :mode="mode" :errors="errors">
    <TipTapEditorMenus
      :editor="editor"
      :mode="mode"
      :show-menu="mode !== 'none'"
      :save-icon-visible="saveIconVisible"
      :save-image-callback="saveImageCallback"
      :disable-save="disableSave"
      @image="emit('image', $event)"
      @saved="emit('saved', $event)"
    />

    <TipTapEditorContent :editor="editor" @drop="onDrop" @blur="onBlur" />
  </TipTapEditorContainer>
</template>
