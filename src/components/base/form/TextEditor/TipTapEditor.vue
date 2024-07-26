<script setup>
import { EditorContent } from '@tiptap/vue-3'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import EditorModalImage from './modals/EditorModalImage.vue'
import EditorModalLink from './modals/EditorModalLink.vue'
import EditorModalColor from './modals/EditorModalColor.vue'
import EditorModalVideo from './modals/EditorModalVideo.vue'

import MenuBar from './MenuBar.vue'
import TableMenuBar from './TableMenuBar.vue'
import LinkMenuBar from './LinkMenuBar.vue'

import ImageMenuBar from './ImageMenuBar.vue'
import VideoMenuBar from './VideoMenuBar.vue'

import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { propsDefinitions, useTipTap } from '@/components/base/form/TextEditor/tiptap-base.js'

const store = useStore()
const { t } = useI18n()

// events
const emit = defineEmits(['saved', 'update', 'destroy', 'image', 'blur'])

// props
const props = defineProps(propsDefinitions)

const {
    editor,
    activeModals,
    linkHref,
    currentColor,
    focusEditor,
    openLinkModal,
    openColorModal,
    openVideoModal,
    openImageModal,
    openDestroyModal,
    handleLinkModalConfirmed,
    handleColorModalConfirmed,
    handleVideoModalConfirmed,
    handleImageModalConfirmed,
    handleImage,
} = useTipTap({ props, emit, store, t })
</script>

<template>
    <div
        v-if="editor"
        :class="'editor editor-' + mode + ' lang-' + $store.state.languages.current"
        @click.self="focusEditor"
    >
        <ConfirmModal
            v-if="activeModals.destroy"
            :content="`${t('description.delete')} ${t('description.edit-saved')}`"
            :title="t('description.quit-without-saving-title')"
            @cancel="activeModals.destroy = false"
            @confirm="activeModals.destroy = false"
        />
        <EditorModalImage
            v-if="activeModals.image"
            :parent="parent"
            :selected-category="selectedCategory"
            @close-modal="activeModals.image = false"
            @image="handleImage"
            @on-confirm="handleImageModalConfirmed"
        />

        <EditorModalLink
            v-if="activeModals.link"
            :link-href="linkHref"
            :has-selection="!editor.view.state.selection.empty"
            @close-modal="activeModals.link = false"
            @on-confirm="handleLinkModalConfirmed"
        />

        <EditorModalColor
            v-if="activeModals.color"
            :current-color="currentColor"
            @close-modal="activeModals.color = false"
            @on-confirm="handleColorModalConfirmed"
        />

        <EditorModalVideo
            v-if="activeModals.video"
            @close-modal="activeModals.video = false"
            @on-confirm="handleVideoModalConfirmed"
        />

        <MenuBar
            v-if="mode !== 'none'"
            :editor="editor"
            :mode="mode"
            :open-color-modal="openColorModal"
            :open-destroy-modal="openDestroyModal"
            :open-image-modal="openImageModal"
            :open-link-modal="openLinkModal"
            :open-video-modal="openVideoModal"
            :save-icon-visible="saveIconVisible"
            class="editor-header"
            @saved="emit('saved')"
        />

        <div class="content-wrapper">
            <TableMenuBar v-if="mode === 'full'" :editor="editor" class="editortablemenu" />

            <LinkMenuBar
                v-if="mode !== 'none'"
                :editor="editor"
                :open-link-modal="openLinkModal"
                class="editorlinkmenu"
            />

            <ImageMenuBar :editor="editor" v-if="mode !== 'none'" />

            <VideoMenuBar :editor="editor" v-if="mode !== 'none'" />

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

    .status-bar,
    .editor-header {
        background: $white;
        color: $primary-dark;
        display: flex;
        padding: 5px 20px;
        position: sticky;
        z-index: 10;
        width: 100%;
    }

    .editor-header {
        justify-content: space-between;
        border-bottom: $border-width-s solid $primary;
        top: 0;

        .icons {
            align-items: center;
            display: flex;

            .menu-item {
                color: $primary-dark;
            }
        }
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
