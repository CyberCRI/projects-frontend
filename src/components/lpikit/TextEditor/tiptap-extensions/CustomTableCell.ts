import TableCell from '@tiptap/extension-table-cell'

const CustomTableCell = TableCell.extend({
    name: 'tableCell',

    addAttributes() {
        return {
            // extend the existing attributes …
            //...(this.parent ? this.parent() : {}),
            ...TableCell.config.addAttributes.call(this),
            // and add a new one …
            backgroundColor: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-background-color'),
                renderHTML: (attributes) => {
                    return {
                        'data-background-color': attributes.backgroundColor,
                        style: `background-color: ${attributes.backgroundColor}`,
                    }
                },
            },
        }
    },
})

export default CustomTableCell
