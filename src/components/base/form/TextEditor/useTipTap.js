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
import useLanguagesStore from '@/stores/useLanguages'

export const emitsDefinitions = ['saved', 'image', 'blur', 'update:modelValue']

export const propsDefinitions = {
    modelValue: { type: String, required: true },
    mode: {
        // mode supports 4 values 'none' | 'simple' | 'medium' | 'full'
        type: String,
        default: 'simple',
    },
    saveIconVisible: {
        type: Boolean,
        default: false,
    },

    saveImageCallback: {
        // function must take a file argument and return a promise resolving to an {url, width, height} object
        type: [Function, null],
        required: false,
    },
}

export function useTipTap({ props, emit, t }) {
    // data
    const editor = ref(null)
    const editorInited = ref(false)
    const initialContent = ref(props.modelValue)
    const languagesStore = useLanguagesStore()

    function appendTranslationsStyle() {
        if (!document.getElementById('multieditor-translations')) {
            let css = ''
            languagesStore.all.forEach((langcode) => {
                css += `[lang="${langcode}"] .ProseMirror-focused .ProseMirror-selectednode .custom-video-wrapper:after { content: '${t(
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
        return props.modelValue
    }

    function initEditor() {
        // this prevents multiple init of editor
        // (that causes duplicate user/content bugs)

        // socket stuff...(no wsdata)

        if (editorInited.value) return
        initialContent.value = props.modelValue
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
            emit('update:modelValue', editor.value.getHTML())
        })
        editor.value.on('blur', (e) => {
            emit('blur', e)
        })
    }

    function destroyEditor() {
        if (editor.value) {
            editor.value.off('update')
            editor.value.destroy()
            editor.value = null
        }
    }

    function resetContent() {
        emit('update:modelValue', initialContent.value)
        editor.value.commands.setContent(initialContent.value)
    }

    return {
        editor,
        editorInited,
        appendTranslationsStyle,
        initEditor,
        destroyEditor,
        getExtensions,
        getContent,
        initialContent,
        resetContent,
    }
}
