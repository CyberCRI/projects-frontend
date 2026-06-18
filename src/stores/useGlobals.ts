import { onClient } from '~/composables/onClient'
import { defineStore } from 'pinia'

const useGlobals = defineStore('useGlobals', () => {
  const uiIsLocked = ref(false)
  const hasUnsavedEdit = ref(false)
  const confirmDiscardPendingEditsPromise = ref(null)
  const uniqueId = '-uiIsLocked'

  watch(
    () => uiIsLocked.value,
    onClient((neo, old) => {
      if (neo !== old) {
        if (neo) {
          document.body.classList.add(`has-open-drawer-${uniqueId}`)
        } else {
          document.body.classList.remove(`has-open-drawer-${uniqueId}`)
        }
      }
    })
  )

  return {
    uiIsLocked,
    hasUnsavedEdit,
    confirmDiscardPendingEditsPromise,
  }
})

export default useGlobals
