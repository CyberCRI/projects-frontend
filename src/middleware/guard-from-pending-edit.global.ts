import useGlobalsStore from '@/stores/useGlobals'

export default defineNuxtRouteMiddleware(function useGuardFromPendingEdit(/*to, from*/) {
  const globalsStore = useGlobalsStore()
  if (globalsStore.hasUnsavedEdit) {
    const answer = window.confirm('You have unsaved changes! Do you really want to leave?')
    if (answer) globalsStore.hasUnsavedEdit = false
    else return abortNavigation()
  }
})
