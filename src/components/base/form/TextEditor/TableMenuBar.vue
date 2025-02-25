<template>
    <LpiBubbleMenu
        :editor="editor"
        :should-show="({ editor }) => editor.isActive('table')"
        class="tablemenu"
        :tippy-options="tippyOptions"
    >
        <ContextualToolMenu class="table-menu-bar">
            <template v-for="(item, index) in items">
                <div class="divider" v-if="item.type === 'divider'" :key="`divider${index}`" />
                <MenuItem v-else v-bind="item" :key="index" />
            </template>
        </ContextualToolMenu>
    </LpiBubbleMenu>
</template>

<script>
import LpiBubbleMenu from '@/components/base/form/TextEditor/LpiBubbleMenu/LpiBubbleMenu.ts'
import MenuItem from './MenuItem.vue'
import { posToDOMRect } from '@tiptap/core'
import ContextualToolMenu from './ContexttualToolMenu.vue'

export default {
    name: 'TableMenuBar',

    components: {
        MenuItem,
        LpiBubbleMenu,
        ContextualToolMenu,
    },

    props: {
        editor: {
            type: Object,
            required: true,
        },
    },

    data() {
        let items = this.computeMenu()
        let tippyOptions = {
            getReferenceClientRect: () => {
                let selection = this.editor.view.state.selection

                // selection range
                const from = Math.min(...selection.ranges.map((range) => range.$from.pos))
                const to = Math.max(...selection.ranges.map((range) => range.$to.pos))

                // get all dom node around the selection
                const tableNodes = []
                this.editor.state.doc.nodesBetween(from, to, (node, pos) => {
                    if (node.isText) {
                        return
                    }
                    // order nodes from closest to farthest up dom tree
                    tableNodes.unshift(this.editor.view.nodeDOM(pos))
                })

                // fetch the first node that is a table one
                let tableNode = null
                for (const node of tableNodes) {
                    if (
                        ['TABLE', 'THEAD', 'TFOOT', 'TBODY', 'TR', 'TH', 'TD'].includes(
                            node.tagName
                        )
                    ) {
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
                return posToDOMRect(this.editor.view, from, to)
            },
        }
        return {
            tippyOptions,
            items,
        }
    },

    methods: {
        computeMenu() {
            return [
                {
                    icon: 'insert-column-left',
                    title: 'multieditor.insert_column_left',
                    action: () => this.editor.chain().focus().addColumnBefore().run(),
                    isDisabled: !this.editor.can().addColumnBefore(),
                },
                {
                    icon: 'insert-column-right',
                    title: 'multieditor.insert_column_right',
                    action: () => this.editor.chain().focus().addColumnAfter().run(),
                    isDisabled: !this.editor.can().addColumnAfter(),
                },
                {
                    icon: 'delete-column',
                    title: 'multieditor.delete_column',
                    action: () => this.editor.chain().focus().deleteColumn().run(),
                    isDisabled: !this.editor.can().deleteColumn(),
                },
                {
                    icon: 'insert-row-top',
                    title: 'multieditor.insert_row_top',
                    action: () => this.editor.chain().focus().addRowBefore().run(),
                    isDisabled: !this.editor.can().addRowBefore(),
                },
                {
                    icon: 'insert-row-bottom',
                    title: 'multieditor.insert_row_bottom',
                    action: () => this.editor.chain().focus().addRowAfter().run(),
                    isDisabled: !this.editor.can().addRowAfter(),
                },
                {
                    icon: 'delete-row',
                    title: 'multieditor.delete_row',
                    action: () => this.editor.chain().focus().deleteRow().run(),
                    isDisabled: !this.editor.can().deleteRow(),
                },
                {
                    icon: 'close-circle-line',
                    title: 'multieditor.delete_table',
                    action: () => this.editor.chain().focus().deleteTable().run(),
                    isDisabled: !this.editor.can().deleteTable(),
                },
                {
                    icon: 'merge-cells-horizontal',
                    title: 'multieditor.merge_cells',
                    action: () => this.editor.chain().focus().mergeCells().run(),
                    isDisabled: !this.editor.can().mergeCells(),
                },
                {
                    icon: 'split-cells-horizontal',
                    title: 'multieditor.split_cell',
                    action: () => this.editor.chain().focus().splitCell().run(),
                    isDisabled: !this.editor.can().splitCell(),
                },
                {
                    icon: 'layout-top-line',
                    title: 'multieditor.toggle_header_row',
                    action: () => this.editor.chain().focus().toggleHeaderRow().run(),
                    isDisabled: !this.editor.can().toggleHeaderColumn(),
                },
            ]
        },

        handleSelectionChange() {
            this.items = this.computeMenu()
        },
    },

    mounted() {
        this.editor.on('selectionUpdate', this.handleSelectionChange)
    },

    beforeUnmount() {
        this.editor.off('selectionUpdate', this.handleSelectionChange)
    },
}
</script>
