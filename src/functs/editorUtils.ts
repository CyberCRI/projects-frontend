export function fixTables(contentNode) {
    const tables = contentNode?.querySelectorAll('table')
    // fix prosemirror/tiptpap bug on cell sizing
    ;[...tables].forEach((table) => {
        const sizedCells = table.querySelectorAll('[colwidth]')
        ;[...sizedCells].forEach((cell) => {
            const w = cell.getAttribute('colwidth')
            cell.style.width = `${w}px`
        })
    })

    // wrap table in a container for scrolling
    ;[...tables].forEach((table) => {
        const wrapper = document.createElement('div')
        wrapper.classList.add('tiptap-table-wrapper')
        table.parentNode.insertBefore(wrapper, table)
        wrapper.appendChild(table)
    })
}

export default function fixEditorContent(contentNode) {
    fixTables(contentNode)
}
