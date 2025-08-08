import { defineStore } from 'pinia'
import { watch, ref } from 'vue'
const useGlobals = defineStore('useGlobals', () => {
  const uiIsLocked = ref(false)
  const hasUnsavedEdit = ref(false)
  const confirmDiscardPendingEditsPromise = ref(null)

  watch(
    () => uiIsLocked.value,
    function (neo, old) {
      if (!import.meta.client) return
      if (neo !== old) {
        const uniqueId = '-uiIsLocked'
        if (neo) {
          document.querySelector('body').classList.add(`has-open-drawer-${uniqueId}`)
        } else {
          document.querySelector('body').classList.remove(`has-open-drawer-${uniqueId}`)
        }
      }
    }
  )

  return {
    uiIsLocked,
    hasUnsavedEdit,
    confirmDiscardPendingEditsPromise,
  }
})

export default useGlobals
