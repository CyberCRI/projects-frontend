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
  const isEqual = computed(() => func())

  // set store block unsaved edit
  const globalStore = useGlobals()
  watchEffect(() => {
    globalStore.hasUnsavedEdit = !isEqual.value
  })

  return isEqual
}
