import { Extension } from '@tiptap/core'
import { UndoManager } from 'yjs'
import { yUndoPluginKey } from 'y-prosemirror'
import type { RawCommands } from '@tiptap/core'
declare module '@tiptap/core' {
  // interface Commands<ReturnType> {
  //     clearhistory: {
  //         /**
  //          * clear history
  //          */
  //         clearHistory: () => ReturnType
  //     }
  // }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const ClearHistoryWS = Extension.create<{}>({
  name: 'clearhistoryws',

  priority: 1000,

  addOptions() {
    return {}
  },

  onCreate() {
    if (
      this.editor.extensionManager.extensions.find(
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
          const undoManager: UndoManager = yUndoPluginKey.getState(state).undoManager
          undoManager.clear()
          return true
        },
    } as Partial<RawCommands>
  },
})
