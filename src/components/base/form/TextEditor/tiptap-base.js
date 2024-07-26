import funct from '@/functs/functions.ts'

import { Editor } from '@tiptap/vue-3'
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

import LpiCodeBlock from './tiptap-extensions/LpiCodeBlock.ts'
import CustomImage from './tiptap-extensions/CustomImage.ts'

import Gapcursor from '@tiptap/extension-gapcursor'

import lowlight from '@/functs/lowlight.ts'

import { ref, reactive, watch, computed, onMounted, onBeforeUnmount } from 'vue'

export const propsDefinitions = {
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
}

export function useTipTap({ props, emit, store, t }) {
    // data
    const editor = ref(null)
    const activeModals = reactive({
        destroy: false,
        image: false,
        link: false,
        video: false,
        color: false,
    })
    const editorInited = ref(false)

    // computed
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

    return {
        editor,
        activeModals,
        editorInited,
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
        handleDestroyModalConfirmed,
        handleImageModalConfirmed,
        handleImage,
        destroyEditor,
    }
}
