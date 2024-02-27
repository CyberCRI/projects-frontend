import hljs from 'highlight.js'

export function fixTables(contentNode) {
    const tables = contentNode?.querySelectorAll('table')
    if (!tables) {
        return // tables is undefined if contentNode DNE
    }
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
        table.classList.remove('auto-width')
        if (!table.parentNode?.classList.contains('tiptap-table-wrapper')) {
            // avoir re-entrance
            const wrapper = document.createElement('div')
            wrapper.classList.add('tiptap-table-wrapper')

            table.parentNode.insertBefore(wrapper, table)
            wrapper.appendChild(table)
        }
        if (table.offsetWidth <= table.parentNode?.offsetWidth) {
            table.classList.add('auto-width')
        }
    })
}

export function patchVideos(contentNode) {
    // transitioal fix for videos still lacking a 'custom-video-ctn' wrapper
    // following redesign of project description page and tiptap table fix
    const videos = contentNode?.querySelectorAll('.custom-video-wrapper')
    if (!videos) {
        return // videos is undefined if contentNode DNE
    }

    ;[...videos].forEach((video) => {
        if (!video.parentNode?.classList.contains('custom-video-ctn')) {
            const wrapper = document.createElement('div')
            wrapper.classList.add('custom-video-ctn')
            video.parentNode.insertBefore(wrapper, video)
            wrapper.appendChild(video)
        }
    })
}

export function fixCodeBlock() {
    hljs.highlightAll()
}

export default function fixEditorContent(contentNode) {
    fixTables(contentNode)
    patchVideos(contentNode)
    fixCodeBlock()
}
