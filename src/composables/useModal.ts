/**
 * composable to easie use for drawer/modal with close/open/toogle
 *
 * @function
 * @name useModal
 * @kind variable
 * @param {boolean) => { close} initialState
 * @param {() => boolean toggle} () => boolean open
 * @param {any} (
 * @returns {boolean; state: globalThis.Ref<boolean, boolean>; }}
 */
const useModal = (initialState: boolean = false) => {
  const state = ref(initialState)
  const close = () => (state.value = false)
  const open = () => (state.value = true)
  const toggle = () => (state.value = !state.value)

  return {
    close,
    open,
    toggle,
    state,
  }
}

export default useModal
