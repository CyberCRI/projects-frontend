<script setup>
import { EditorContent } from '@tiptap/vue-3'
import { computed } from 'vue'

// props
const props = defineProps({
  editor: { type: Object, required: true },
  editorFrozen: { type: Boolean, default: false },
  isConnected: { type: Boolean, default: false },
})

// computed
const dataTest = computed(() =>
  props.isConnected ? 'input-editor-content-connected' : 'input-editor-content-simple'
)
</script>
<template>
  <div class="content-wrapper">
    <EditorContent
      :editor="editor"
      class="editor-content custom-scrollbar"
      :class="{ 'editor-frozen': editorFrozen }"
      :data-test="dataTest"
    />
  </div>
</template>
<style lang="scss" scoped>
.content-wrapper {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

.editor-content {
  color: $black;
  padding: 8px;
  overflow-y: auto;
  min-height: 100px;
  flex-grow: 1;
  margin-right: $space-2xs;

  .ProseMirror {
    outline: none;
    padding: 30px;
    border: none;
    background: $primary-lighter;

    & * {
      word-wrap: break-word !important;
    }
  }

  .anchor-element {
    display: block;
    position: relative;
    visibility: hidden;
  }
}

// TODO: this  break vue 3 compilation fix this later
:deep(.content),
:deep(.editor-content) {
  /* Give a remote user a caret */
  .collaboration-cursor__caret {
    position: relative;
    margin-left: -1px;
    margin-right: -1px;
    border-left: 1px solid $almost-black;
    border-right: 1px solid $almost-black;
    word-break: normal;
    pointer-events: none;
  }

  /* Render the username above the caret */
  .collaboration-cursor__label {
    font-family: Roboto, 'Noto Sans SC', helvetica, arial, sans-serif;
    position: absolute;
    top: -1em;
    left: -1px;
    font-size: $font-size-2xs;
    font-style: normal;
    font-weight: 600;
    line-height: $line-height-tight;
    user-select: none;
    color: $white;
    padding: 0.1rem 0.3rem;
    border-radius: 3px 3px 3px 0;
    white-space: nowrap;
    opacity: 0.7;
    pointer-events: none;
  }

  .not-synced {
    padding: 20px;
  }

  .editor .selectedCell {
    outline: $primary dashed 1px;
  }

  .editor * {
    overflow-wrap: break-word;
    hyphens: auto;
  }

  .editor table {
    max-width: 100% !important;
    min-width: auto !important;
  }

  .editor th {
    background-color: $almost-black;
    color: $white;
  }

  .editor-frozen .ProseMirror {
    background-color: $almost-white;
  }
}
</style>
