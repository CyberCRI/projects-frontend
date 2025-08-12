import useGlobalsStore from '@/stores/useGlobals'

export default defineNuxtRouteMiddleware(async function useGuardFromPendingEdit(/*to, from*/) {
  const globalsStore = useGlobalsStore()
  if (globalsStore.hasUnsavedEdit) {
    let answer = true
    try {
      answer = await new Promise((accept) => {
        globalsStore.confirmDiscardPendingEditsPromise = accept
      })
    } catch (e) {
      console.error(e)
    } finally {
      globalsStore.confirmDiscardPendingEditsPromise = null
    }
    if (answer) globalsStore.hasUnsavedEdit = false
    else return abortNavigation()
  }
})
