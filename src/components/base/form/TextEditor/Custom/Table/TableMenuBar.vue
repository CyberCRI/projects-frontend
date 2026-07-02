<script setup lang="ts">
import { posToDOMRect } from '@tiptap/core'

import LpiBubbleMenu from '~/components/base/form/TextEditor/LpiBubbleMenu'

import type { IconImageChoice } from '~/functs/IconImage.js'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()

const { t } = useNuxtI18n()

const tippyOptions = {
  getReferenceClientRect: () => {
    const selection = props.editor.view.state.selection

    // selection range
    const from = Math.min(...selection.ranges.map((range) => range.$from.pos))
    const to = Math.max(...selection.ranges.map((range) => range.$to.pos))

    // get all dom node around the selection
    const tableNodes = []
    props.editor.state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.isText) {
        return
      }
      // order nodes from closest to farthest up dom tree
      tableNodes.unshift(props.editor.view.nodeDOM(pos))
    })

    // fetch the first node that is a table one
    let tableNode = null
    for (const node of tableNodes) {
      if (['TABLE', 'THEAD', 'TFOOT', 'TBODY', 'TR', 'TH', 'TD'].includes(node.tagName)) {
        tableNode = node
        break
      }
    }
    // if we have a table node position menu against it
    if (tableNode) {
      return tableNode.getBoundingClientRect()
    }

    // otherwise fallback to positioning against the selection
    // (this theorically should never happen but let's play safe)
    return posToDOMRect(props.editor.view, from, to)
  },
}

const items = computed(() => {
  return [
    {
      icon: 'insertColumnLeft',
      title: t('multieditor.insert_column_left'),
      action: () => props.editor.chain().focus().addColumnBefore().run(),
      disabled: !props.editor.can().addColumnBefore(),
    },
    {
      icon: 'insertColumnRight',
      title: t('multieditor.insert_column_right'),
      action: () => props.editor.chain().focus().addColumnAfter().run(),
      disabled: !props.editor.can().addColumnAfter(),
    },
    {
      icon: 'deleteColumn',
      title: t('multieditor.delete_column'),
      action: () => props.editor.chain().focus().deleteColumn().run(),
      disabled: !props.editor.can().deleteColumn(),
    },
    {
      icon: 'insertRowTop',
      title: t('multieditor.insert_row_top'),
      action: () => props.editor.chain().focus().addRowBefore().run(),
      disabled: !props.editor.can().addRowBefore(),
    },
    {
      icon: 'insertRowBottom',
      title: t('multieditor.insert_row_bottom'),
      action: () => props.editor.chain().focus().addRowAfter().run(),
      disabled: !props.editor.can().addRowAfter(),
    },
    {
      icon: 'deleteRow',
      title: t('multieditor.delete_row'),
      action: () => props.editor.chain().focus().deleteRow().run(),
      disabled: !props.editor.can().deleteRow(),
    },
    {
      icon: 'mergeCellsHorizontal',
      title: t('multieditor.merge_cells'),
      action: () => props.editor.chain().focus().mergeCells().run(),
      disabled: !props.editor.can().mergeCells(),
    },
    {
      icon: 'splitCellsHorizontal',
      title: t('multieditor.split_cell'),
      action: () => props.editor.chain().focus().splitCell().run(),
      disabled: !props.editor.can().splitCell(),
    },
    {
      icon: 'layoutTopLine',
      title: t('multieditor.toggle_header_row'),
      action: () => props.editor.chain().focus().toggleHeaderRow().run(),
      disabled: !props.editor.can().toggleHeaderColumn(),
    },
    {
      icon: 'Close',
      title: t('multieditor.delete_table'),
      action: () => props.editor.chain().focus().deleteTable().run(),
      disabled: !props.editor.can().deleteTable(),
    },
  ] satisfies {
    icon: IconImageChoice
    title: string
    action: () => void
    disabled: boolean
  }[]
})
</script>

<template>
  <LpiBubbleMenu
    :editor="editor"
    :should-show="({ editor }) => editor.isActive('table')"
    class="tablemenu"
    :tippy-options="tippyOptions"
    plugin-key="TableMenu"
  >
    <ContexttualToolMenu class="table-menu-bar">
      <MenuItem
        v-for="item in items"
        :key="item.title"
        :icon="item.icon"
        :disabled="item.disabled"
        :title="item.title"
        :action="item.action"
      />
    </ContexttualToolMenu>
  </LpiBubbleMenu>
</template>
