<script setup>
import { useStore } from 'vuex'
const store = useStore()

defineProps({
    mode: { type: String, required: true },
})

// methods
function focusEditor() {
    if (editor) {
        editor.commands.focus('end')
    }
}
</script>
<template>
    <div
        :class="{
            ['editor editor-' + mode]: true,
            ['lang-' + store.state.languages.current]: true,
        }"
        @click.self="focusEditor"
    >
        <slot></slot>
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
