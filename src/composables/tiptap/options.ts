import type { StarterKitOptions } from '@tiptap/starter-kit'
import TableHeader from '@tiptap/extension-table-header'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import TableRow from '@tiptap/extension-table-row'
import StarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'

import CustomTableCell from '~/composables/tiptap/extensions/CustomTableCell'
import ExternalVideo from '~/composables/tiptap/extensions/ExternalVideo'
import LpiCodeBlock from '~/composables/tiptap/extensions/LpiCodeBlock'
import CustomImage from '~/composables/tiptap/extensions/CustomImage'
import lowlight from '~/functs/lowlight'

export const getExtensions = (options: Partial<StarterKitOptions> = {}) => [
  StarterKit.configure({ ...options, codeBlock: false }),
  Link.configure({
    openOnClick: false,
  }),
  TextStyle,
  Color,
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
