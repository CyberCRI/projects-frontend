import { defineStore } from 'pinia'
import { watch, ref } from 'vue'
const useGlobals = defineStore('useGlobals', () => {
  const uiIsLocked = ref(false)

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
  }
})

export default useGlobals
