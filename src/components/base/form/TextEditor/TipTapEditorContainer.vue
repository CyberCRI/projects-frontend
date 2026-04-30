<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const props = withDefaults(
  defineProps<{
    mode: string
    editor?: Editor
  }>(),
  {
    editor: null,
  }
)

// methods
function focusEditor() {
  if (props.editor) {
    props.editor.commands.focus('end')
  }
}

const { locale } = useNuxtI18n()
</script>
<template>
  <div
    :class="{
      ['editor editor-' + mode]: true,
      ['lang-' + locale]: true,
    }"
    @click.self="focusEditor"
  >
    <slot />
  </div>
</template>
<style lang="scss" scoped>
.editor {
  overflow: hidden;
  border-radius: $border-radius-l;
  border: $border-width-s solid $primary;
  display: flex;
  flex-flow: column nowrap;

  &.no-max-height {
    :deep(.editor-content) {
      max-height: none;
    }
  }

  &.min-height-100 {
    :deep(.editor-content) {
      min-height: 100%;
    }
  }
}
</style>
