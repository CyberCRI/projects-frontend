<script setup>
import funct from '@/functs/functions.ts'

import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Color from '@tiptap/extension-color'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TextStyle from '@tiptap/extension-text-style'

import CustomTableCell from './tiptap-extensions/CustomTableCell.ts'
import ExternalVideo from './tiptap-extensions/ExternalVideo.ts'

import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import EditorModalImage from './modals/EditorModalImage.vue'
import EditorModalLink from './modals/EditorModalLink.vue'
import EditorModalColor from './modals/EditorModalColor.vue'
import EditorModalVideo from './modals/EditorModalVideo.vue'

import MenuBar from './MenuBar.vue'
import TableMenuBar from './TableMenuBar.vue'
import LinkMenuBar from './LinkMenuBar.vue'

import LpiCodeBlock from './tiptap-extensions/LpiCodeBlock.ts'
import CustomImage from './tiptap-extensions/CustomImage.ts'
import ImageMenuBar from './ImageMenuBar.vue'
import VideoMenuBar from './VideoMenuBar.vue'

import Gapcursor from '@tiptap/extension-gapcursor'

import lowlight from '@/functs/lowlight.ts'

import { ref, reactive, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { t } = useI18n()

// events
const emit = defineEmits(['saved', 'update', 'destroy', 'image', 'blur'])

// props
const props = defineProps({
    mode: {
        // mode supports 4 values 'none' | 'simple' | 'medium' | 'full'
        type: String,
        default: 'simple',
    },
    wsData: {
        type: Object,
        required: true,
    },
    saveIconVisible: {
        type: Boolean,
        default: true,
    },

    parent: {
        type: String,
        default: '',
    },

    selectedCategory: {
        // TODO really ???
        type: Object,
        default: () => {},
    },
})

// data
const editor = ref(null)
const type = ref(null)
const provider = ref(null)
const activeModals = reactive({
    destroy: false,
    image: false,
    link: false,
    video: false,
    color: false,
})
const editorInited = ref(false)

// computed
const user = computed(() => store.getters['users/userFromApi'])
const accessToken = computed(() => store.getters['users/accessToken'])
const linkHref = computed(() => editor.value.getAttributes('link').href)
const currentColor = computed(() => editor.value.getAttributes('textStyle').color)

// methods
function focusEditor() {
    if (editor.value) {
        editor.value.commands.focus('end')
    }
}

function appendTranslationsStyle() {
    if (!document.getElementById('multieditor-translations')) {
        let css = ''
        store.state.languages.all.forEach((langcode) => {
            css += `.lang-${langcode} .ProseMirror-focused .custom-video-wrapper.ProseMirror-selectednode:after { content: '${t(
                'multieditor.click-to-play-video',
                langcode
            )}'; }
                    `
        })
        const head = document.head || document.getElementsByTagName('head')[0]
        const style = document.createElement('style')
        style.innerHTML = css
        style.id = 'multieditor-translations'
        head.appendChild(style)
    }
}

function initEditor() {
    // this prevents multiple init of editor
    // (that causes duplicate user/content bugs)
    if (editorInited.value) return
    editorInited.value = true

    const getExtensions = () => {
        let exts = [
            // Collaborative (socket) use its own history
            StarterKit.configure({ history: true }), // TODO: was !this.socket
            Link.configure({
                openOnClick: false,
            }),
            TextStyle,
            Color,
            // TODO: Check if need history
            // History,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right'],
            }),
            ExternalVideo,
            Table.configure({
                resizable: true,
                cellMinWidth: 300,
            }),
            TableRow,
            TableHeader,
            CustomTableCell,
            CustomImage,
            Gapcursor,
            LpiCodeBlock.configure({
                lowlight,
            }),
        ]

        return exts
    }

    const getContent = () => {
        return props.wsData.originalContent
    }

    if (editor.value) destroyEditor()

    editor.value = new Editor({
        content: getContent(),
        extensions: getExtensions(),
        parseOptions: {
            preserveWhitespace: 'full',
        },
    })
    editor.value.on('update', () => {
        emit('update', editor.value.getHTML())
    })
    editor.value.on('blur', (e) => {
        emit('blur', e)
    })
}

function openLinkModal() {
    activeModals.link = true
}

function openColorModal() {
    activeModals.color = true
}

function openVideoModal() {
    activeModals.video = true
}

function openImageModal() {
    activeModals.image = true
}

function openDestroyModal() {
    activeModals.destroy = true
}

function handleLinkModalConfirmed(data) {
    // set the link if there's data from popup
    if (data) {
        editor.value
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({
                href: (funct.isValidUrl(data.href) ? '' : 'http://') + data.href,
            })
            .run()
        // if link made from empty selection, add the entered text as content
        if (data.text) {
            const selection = editor.value.view.state.selection
            editor.value
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
        editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    }

    activeModals.link = false
}

function handleColorModalConfirmed(data) {
    if (data) {
        editor.value.chain().focus().setColor(data).run()
    } else {
        editor.value.chain().focus().unsetColor().run()
    }

    activeModals.link = false
}

function handleVideoModalConfirmed(data) {
    editor.value.chain().focus().setExternalVideo({ src: data.src }).run()

    activeModals.video = false
}

function handleDestroyModalConfirmed() {
    // reset modification
    emit('update', props.wsData.originalContent)
    editor.value.commands.setContent(props.wsData.originalContent)

    activeModals.destroy = false
    emit('destroy')
}

function handleImageModalConfirmed(img) {
    const attrsw = img.sizeX < 1100 ? img.sizeX : 1100
    const attrsh = img.sizeX < 1100 ? img.sizeY : img.sizeY * (1100 / parseFloat(img.sizeX))

    editor.value
        .chain()
        .focus()
        .setImage({
            src: img.src,
            width: attrsw,
            height: attrsh,
        })
        .run()

    activeModals.image = false
}

function handleImage(img) {
    emit('image', img)
}

function destroyEditor() {
    if (editor.value) {
        editor.value.off('update')
        editor.value.destroy()
    }
}

watch(
    () => props.wsData,
    () => {
        editorInited.value = false
        // Reinit editor so that changes in wsData props are visible in editor
        initEditor()
    }
)

// lifecycle
onMounted(() => {
    appendTranslationsStyle()
    initEditor()
})

onBeforeUnmount(() => {
    destroyEditor()
})
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
