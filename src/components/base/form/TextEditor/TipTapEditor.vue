<script setup>
import { EditorContent } from '@tiptap/vue-3'
import TipTapModals from '@/components/base/form/TextEditor/TipTapModals.vue'
import { watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import {
    emitsDefinitions,
    propsDefinitions,
    useTipTap,
} from '@/components/base/form/TextEditor/useTipTap.js'

const store = useStore()
const { t } = useI18n()

// events
const emit = defineEmits(emitsDefinitions)

// props
const props = defineProps(propsDefinitions)

const { editor, editorInited, focusEditor, appendTranslationsStyle, initEditor, destroyEditor } =
    useTipTap({ props, emit, store, t })

// lifecycle
onMounted(() => {
    appendTranslationsStyle()
    initEditor()
})

onBeforeUnmount(() => {
    destroyEditor()
})

// watcher

watch(
    () => props.wsData,
    () => {
        editorInited.value = false
        // Reinit editor so that changes in wsData props are visible in editor
        initEditor()
    }
)
</script>

<template>
    <div
        v-if="editor"
        :class="'editor editor-' + mode + ' lang-' + $store.state.languages.current"
        @click.self="focusEditor"
    >
        <TipTapModals
            :editor="editor"
            :parent="parent"
            :mode="mode"
            :selected-category="selectedCategory"
            :show-menu="mode !== 'none'"
            :save-icon-visible="saveIconVisible"
            @image="emit('image', $event)"
            @update="emit('update', $event)"
            @destroy="emit('destroy', $event)"
            @saved="emit('saved', $event)"
        />

        <div class="content-wrapper">
            <EditorContent
                ref="editorContent"
                :editor="editor"
                class="editor-content custom-scrollbar"
                data-test="input-editor-content-simple"
            />
        </div>
    </div>
</template>

<!--SCOPED TO FIX BUG ON DEFAULT EDITOR, UN-SCOPE IF NEEDED LATER-->
<style lang="scss" scoped>
.editor {
    overflow: hidden;
    border-radius: $border-radius-l;
    border: $border-width-s solid $primary;
    display: flex;
    flex-flow: column nowrap;

    .not-synced {
        padding: 20px;
    }

    .content-wrapper {
        display: flex;
        flex-grow: 1;
        overflow: hidden;
    }

    .editor-content {
        color: $black;
        padding: 8px;
        overflow-y: auto;
        max-height: 430px;
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

    &.no-max-height {
        .editor-content {
            max-height: none;
        }
    }

    &.min-height-100 {
        .editor-content {
            min-height: 100%;
        }
    }

    .status-bar {
        background: $white;
        color: $primary-dark;
        display: flex;
        padding: 5px 20px;
        position: sticky;
        z-index: 10;
        width: 100%;
    }

    .editor-socket {
        align-items: center;
        background: $primary-lighter;
        display: flex;
        justify-content: space-between;
    }

    .editor-status {
        align-items: center;
        color: $white;
        display: flex;
        justify-content: space-between;
        padding: 5px 20px;

        .list {
            align-items: center;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
        }
    }
}

.connecting,
.disconnected {
    padding: 20px;
    text-align: center;
}

.status-bar {
    justify-content: center;
    top: 30px;

    &.editor-frozen {
        top: 0;
    }

    .connection-status {
        padding: 0 2rem;
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
