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

import { ref } from 'vue'

export const emitsDefinitions = ['saved', 'update', 'destroy', 'image', 'blur']

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
        default: () => ({}),
    },
}

export function useTipTap({ props, emit, store, t }) {
    // data
    const editor = ref(null)

    const editorInited = ref(false)

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

    function getExtensions() {
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

    function getContent() {
        return props.wsData.originalContent
    }

    function initEditor() {
        // this prevents multiple init of editor
        // (that causes duplicate user/content bugs)

        // socket stuff...(no wsdata)

        if (editorInited.value) return
        editorInited.value = true

        // socket stuffs...  (provider, timer, online event)

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

    function destroyEditor() {
        if (editor.value) {
            editor.value.off('update')
            editor.value.destroy()
        }
    }

    return {
        editor,
        editorInited,
        appendTranslationsStyle,
        initEditor,
        destroyEditor,
        getExtensions,
        getContent,
    }
}
