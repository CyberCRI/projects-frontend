import useGlobalsStore from '~/stores/useGlobals'

/**
 * block navigations if form is unsaded
 *
 * @function
 * @name useBlockNavigation
 * @kind variable
 * @param {() => boolean} func
 * @returns {globalThis.ComputedRef<boolean>}
 * @exports
 */
export const useBlockNavigation = (func: () => boolean): ComputedRef<boolean> => {
  const mounted = ref(false)
  const isEqual = computed(() => func())

  // set store block unsaved edit
  const globalStore = useGlobalsStore()
  watchEffect(
    onClient(() => {
      if (mounted.value) {
        globalStore.hasUnsavedEdit = !isEqual.value
      }
    })
  )

  onUnmounted(() => {
    if (!isEqual.value) {
      globalStore.hasUnsavedEdit = false
    }
  })

  onClientMounted(() => (mounted.value = true))
  return isEqual
}
