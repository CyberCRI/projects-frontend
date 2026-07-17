import { Extension } from '@tiptap/core'

import { yUndoPluginKey } from 'y-prosemirror'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    clearhistoryws: {
      /**
       * clear history
       */
      clearHistoryWS: () => ReturnType
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const ClearHistoryWS = Extension.create<{}>({
  name: 'clear-history-ws',

  priority: 1000,

  addOptions() {
    return {}
  },

  onCreate() {
    if (
      !this.editor.extensionManager.extensions.find(
        (extension) => extension.name === 'collaboration'
      )
    ) {
      console.warn('[tiptap warn]: clear history must only be used with collaboration extension.')
    }
  },

  addCommands() {
    return {
      clearHistoryWS:
        () =>
        ({ tr, state }) => {
          tr.setMeta('preventDispatch', true)
          const undoManager = yUndoPluginKey.getState(state)?.undoManager
          undoManager?.clear()
          return true
        },
    }
  },
})
