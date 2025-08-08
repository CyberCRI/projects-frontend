import useGlobalsStore from '@/stores/useGlobals'

export default defineNuxtRouteMiddleware(async function useGuardFromPendingEdit(/*to, from*/) {
  const globalsStore = useGlobalsStore()
  if (globalsStore.hasUnsavedEdit) {
    // const answer = window.confirm('You have unsaved changes! Do you really want to leave?')
    let answer = true
    try {
      answer = await new Promise((accept) => {
        globalsStore.confirmDiscardPendingEditsPromise = accept
      })
    } catch (e) {
      console.error(e)
    } finally {
      console.log('answer is', answer)
      globalsStore.confirmDiscardPendingEditsPromise = null
    }
    if (answer) globalsStore.hasUnsavedEdit = false
    else return abortNavigation()
  }
})
