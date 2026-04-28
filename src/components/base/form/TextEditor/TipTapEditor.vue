<script setup lang="ts">
import TipTapEditorContainer from '~/components/base/form/TextEditor/TipTapEditorContainer.vue'
import TipTapEditorContent from '~/components/base/form/TextEditor/TipTapEditorContent.vue'
import TipTapModals from '~/components/base/form/TextEditor/TipTapModals.vue'
import {
  emitsDefinitions,
  PropsDefault,
  PropsDefinitions,
  useTipTap,
} from '~/components/base/form/TextEditor/useTipTap'
import { onMounted, onBeforeUnmount } from 'vue'

const { t } = useNuxtI18n()

// events
const emit = defineEmits(emitsDefinitions)

// props
const props = withDefaults(defineProps<PropsDefinitions>(), PropsDefault)

const { editor, onDrop, resetContent, appendTranslationsStyle, initEditor, destroyEditor } =
  useTipTap({
    props,
    emit,
    t,
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
  <TipTapEditorContainer v-if="editor" :editor="editor" :mode="mode">
    <TipTapModals
      :editor="editor"
      :mode="mode"
      :show-menu="mode !== 'none'"
      :save-icon-visible="saveIconVisible"
      :save-image-callback="saveImageCallback"
      :disable-save="disableSave"
      @image="emit('image', $event)"
      @saved="emit('saved', $event)"
    />

    <TipTapEditorContent :editor="editor" @drop="onDrop" />
  </TipTapEditorContainer>
</template>
