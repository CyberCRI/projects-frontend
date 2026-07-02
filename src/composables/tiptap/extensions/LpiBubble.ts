import { Extension } from '@tiptap/core'

import {
  LpiBubbleMenuPlugin,
  type LpiBubbleMenuPluginProps,
} from '~/composables/tiptap/extensions/LpiBubblePlugin'
import type { Editor } from '@tiptap/vue-3'

export type LpiBubbleMenuOptions = Omit<LpiBubbleMenuPluginProps, 'editor' | 'element'> & {
  element: HTMLElement | null
}

export default Extension.create<LpiBubbleMenuOptions>({
  name: 'lpiBubbleMenu',

  addOptions() {
    return {
      element: null,
      tippyOptions: {},
      pluginKey: 'lpiBubbleMenu',
      updateDelay: undefined,
      shouldShow: null,
    }
  },

  addProseMirrorPlugins() {
    if (!this.options.element) {
      return []
    }

    return [
      LpiBubbleMenuPlugin({
        pluginKey: this.options.pluginKey,
        editor: this.editor as Editor,
        element: this.options.element,
        tippyOptions: this.options.tippyOptions,
        updateDelay: this.options.updateDelay,
        shouldShow: this.options.shouldShow,
      }),
    ]
  },
})
