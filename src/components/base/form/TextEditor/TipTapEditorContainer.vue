<script setup>
import useLanguagesStore from '@/stores/useLanguages'

const props = defineProps({
  mode: { type: String, required: true },
  editor: { type: Object, required: true },
})

// methods
function focusEditor() {
  if (props.editor) {
    props.editor.commands.focus('end')
  }
}

const languagesStore = useLanguagesStore()
</script>
<template>
  <div
    :class="{
      ['editor editor-' + mode]: true,
      ['lang-' + languagesStore.current]: true,
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
