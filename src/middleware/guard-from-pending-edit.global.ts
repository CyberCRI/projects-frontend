import useGlobalsStore from '~/stores/useGlobals'

export default defineNuxtRouteMiddleware(
  onClient(async () => {
    const globalsStore = useGlobalsStore()
    if (!globalsStore.hasUnsavedEdit) {
      return
    }

    return new Promise((accept) => {
      globalsStore.confirmDiscardPendingEditsPromise = accept
    })
      .then((answer: boolean) => {
        if (!answer) {
          return abortNavigation()
        }
        globalsStore.hasUnsavedEdit = false
      })
      .catch((err) => {
        console.error(err)
        // if errors co to next page
        globalsStore.hasUnsavedEdit = false
      })
      .finally(() => {
        globalsStore.confirmDiscardPendingEditsPromise = null
      })
  })
)
