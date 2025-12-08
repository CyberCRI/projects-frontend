import hljs from 'highlight.js'
import { throttle } from 'es-toolkit'

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
    if (!table.parentNode?.classList.contains('tiptap-table-absolutizer')) {
      // avoir re-entrance

      const wrapper = document.createElement('div')
      wrapper.classList.add('tiptap-table-wrapper')

      //
      wrapper.setAttribute('style', `height:${table.clientHeight}px;`)

      const absolutizer = document.createElement('div')
      absolutizer.classList.add('tiptap-table-absolutizer')

      absolutizer.setAttribute(
        'style',
        `
      position:absolute;
      inset:0;
      overflow: auto;
      `
      )

      wrapper.appendChild(absolutizer)

      table.parentNode.insertBefore(wrapper, table)
      absolutizer.appendChild(table)
    }
    if (table.offsetWidth <= table.parentNode?.offsetWidth) {
      table.classList.add('auto-width')
    }

    // fix a (transitional or resolved since ?) bug in tiptap table
    // that affect some tables
    const styleString = table.getAttribute('style')
    if (styleString) {
      const fixedStyle = styleString.replace('minWidth:', 'min-width:')
      table.setAttribute('style', fixedStyle)
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

export const fixTiptapTableHeight = throttle(() => {
  const wrappers = document.querySelectorAll('.tiptap-table-wrapper')
  for (const wrapper of wrappers) {
    const table = wrapper.querySelector('table')
    wrapper.setAttribute('style', `height:${table.clientHeight + 2}px;`)
  }
}, 100)

export default function fixEditorContent(contentNode) {
  fixTables(contentNode)
  patchVideos(contentNode)
  fixCodeBlock()
}
