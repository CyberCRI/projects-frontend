import type { ImageModelCreated } from 'shared-projects-frontend/models'
import useOrganizationsStore from '~/stores/useOrganizations'

// this is needed to module overide in tiptap commands (only for typescript)
import '@tiptap/extension-ordered-list'
import '@tiptap/extension-bullet-list'
import '@tiptap/extension-text-style'
import '@tiptap/extension-text-align'
import '@tiptap/extension-table-cell'
import '@tiptap/extension-blockquote'
import '@tiptap/extension-underline'
import '@tiptap/extension-table-row'
import '@tiptap/extension-list-item'
import '@tiptap/extension-heading'
import '@tiptap/extension-italic'
import '@tiptap/extension-table'
import '@tiptap/extension-color'
import '@tiptap/extension-bold'
import '@tiptap/starter-kit'

import { getExtensions } from '~/composables/tiptap/extensions/all'
import type { ErrorObject } from '@vuelidate/core'
import type { EditorOptions } from '@tiptap/vue-3'
import type { ExtractDefaultPropTypes } from 'vue'
import useToasterStore from '~/stores/useToaster'
import { Editor } from '@tiptap/vue-3'

export const emitsDefinitions = ['saved', 'image', 'blur', 'update:modelValue']

export type PropsDefinitions = {
  modelValue?: string
  mode?: 'none' | 'simple' | 'medium' | 'full'
  errors?: ErrorObject[]
  saveIconVisible?: boolean
  // function must take a file argument and return a promise resolving to an {url, width, height} object
  saveImageCallback?: (image: File) => Promise<ImageModelCreated>
  disableSave?: boolean
}

export const PropsDefault: ExtractDefaultPropTypes<PropsDefinitions> = {
  mode: 'simple',
  saveIconVisible: false,
  saveImageCallback: null,
  disableSave: false,
  errors: () => [],
}

type Options = {
  props: any
  emit: any
  t: any
  extraOptions?: any
}

type TipTapResult = {
  editor: Ref<any>
  editorInited: Ref<boolean>
  appendTranslationsStyle: () => void
  initEditor: () => void
  destroyEditor: () => void
  getContent: () => string
  initialContent: Ref<string>
  resetContent: () => void
  onUpdate: EditorOptions['onUpdate']
  onBlur: EditorOptions['onBlur']
  onDrop: EditorOptions['onDrop']
  onPaste: EditorOptions['onPaste']
}

export const useTipTap = ({ props, emit, t, extraOptions }: Options): TipTapResult => {
  // data
  const editor = ref<Editor | undefined>(undefined)
  const editorInited = ref(false)
  const initialContent = ref<string>(props.modelValue)
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
    toaster.pushError(t('resource.file.form.too-big', { maxSize: '1' }))
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
      ...(extraOptions || {}),
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
    editor.value?.commands.setContent(initialContent.value)
  }

  return {
    editor,
    editorInited,
    appendTranslationsStyle,
    initEditor,
    destroyEditor,
    getContent,
    initialContent,
    resetContent,
    onUpdate,
    onBlur,
    onDrop,
    onPaste,
  }
}
