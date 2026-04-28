import TableHeader from '@tiptap/extension-table-header'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import TableRow from '@tiptap/extension-table-row'
import StarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import { Editor } from '@tiptap/vue-3'

import useOrganizationsStore from '~/stores/useOrganizations'
import useToasterStore from '~/stores/useToaster'

import CustomTableCell from './tiptap-extensions/CustomTableCell.js'
import ExternalVideo from './tiptap-extensions/ExternalVideo.js'
import LpiCodeBlock from './tiptap-extensions/LpiCodeBlock.js'
import CustomImage from './tiptap-extensions/CustomImage.js'
import lowlight from '~/functs/lowlight'

export const emitsDefinitions = ['saved', 'image', 'blur', 'update:modelValue']

export type PropsDefinitions = {
  modelValue: string
  mode?: 'none' | 'simple' | 'medium' | 'full'
  saveIconVisible?: boolean
  // function must take a file argument and return a promise resolving to an {url, width, height} object
  saveImageCallback?: (image) => void
  disableSave?: boolean
}

export const PropsDefault: Partial<PropsDefinitions> = {
  mode: 'simple',
  saveIconVisible: false,
  saveImageCallback: null,
  disableSave: false,
}

export function useTipTap({ props, emit, t }) {
  // data
  const editor = ref(null)
  const editorInited = ref(false)
  const initialContent = ref(props.modelValue)
  const toaster = useToasterStore()
  const organizationsStore = useOrganizationsStore()

  const onUpdate = ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }

  const onBlur = (e) => {
    emit('blur', e)
  }

  const isImageAuthorized = (files) => {
    // TODO check file types
    // dont block if no files (to allow text paste/drop)
    return !files?.length || props.mode === 'full'
  }

  const checkFileSizes = (files) => {
    for (let i = 0; i < files?.length; i++) {
      const file = files[i]
      // get file size
      const fileSize = file.size // in bytes
      // check if file size is less than 1MB
      if (fileSize > 1 * 1024 * 1024) {
        throw new Error(`File ${file.name} is too big: ${fileSize} bytes`)
      }
    }
  }

  const onFileSizeError = (evt, err) => {
    console.error(err)
    evt.preventDefault()
    toaster.pushError(t('common.file-too-big', { maxSize: '1' }))
  }

  const onDrop = (evt) => {
    // get file from drop event
    try {
      if (!isImageAuthorized(evt?.dataTransfer?.files)) evt.preventDefault()
      else checkFileSizes(evt?.dataTransfer?.files)
    } catch (err) {
      onFileSizeError(evt, err)
    }
  }

  const onPaste = (evt) => {
    // get file from drop event
    try {
      if (!isImageAuthorized(evt?.clipboardData?.files)) evt.preventDefault()
      else checkFileSizes(evt?.clipboardData?.files)
    } catch (err) {
      onFileSizeError(evt, err)
    }
  }

  function appendTranslationsStyle() {
    if (!document.getElementById('multieditor-translations')) {
      let css = ''
      organizationsStore.languages.forEach((langcode) => {
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

  function getExtensions(options: { disableHistory: any } = { disableHistory: false }) {
    const history = options?.disableHistory || false
    return [
      // Collaborative (socket) use its own history
      StarterKit.configure({ history, codeBlock: false }), // TODO: was !this.socket
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
      LpiCodeBlock.configure({
        lowlight,
      }),
    ]
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
      onUpdate,
      onBlur,
      // onDrop, for some reason doent work here, put it on component TipTapEditorContent
      onPaste,
    })

    editor.value.view.dom.addEventListener('drop', onDrop, true)
    // editor.value.on('update', onUpdate)
    // editor.value.on('blur', onBlur)
    // editor.value.on('onDrop', onDrop) // yes event naming is weird
    // editor.value.on('onPaste', onPaste) // yes event naming is weird
  }

  function destroyEditor() {
    if (editor.value) {
      // editor.value.off('update', onUpdate)
      // editor.value.off('blur', onBlur)
      // editor.value.off('onDrop', onDrop) // yes event naming is weird
      // editor.value.off('onPaste', onPaste) // yes event naming is weird
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
    onUpdate,
    onBlur,
    onDrop,
    onPaste,
  }
}
