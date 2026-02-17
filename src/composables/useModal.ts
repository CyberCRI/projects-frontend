/**
 * interacte with multiple modals
 *
 * @constant
 * @name useModals
 * @kind variable
 * @type {<modalNames = { [key: string]: boolean; }>(defaultValue: Partial<modalNames>) => { stateModal: [Partial<modalNames>] extends [globalThis.Ref<any, any>] ? IfAny<globalThis.Ref<any, any> & Partial<modalNames>, globalThis.Ref<globalThis.Ref<any, any> & Partial<modalNames>, globalThis.Ref<any, any> & Partial<modalNames>>, globalThis.Ref<any, any> & Partial<modalNames>> : globalThis.Ref<...>; openModal: <K extends keyof modalNames>(key: K) => void; closeModal: <K extends keyof modalNames>(key: K) => void; toggleModal: <K extends keyof modalNames>(key: K) => void; }}
 * @exports
 */
export const useModals = <modalNames = { [key: string]: boolean }>(
  defaultValue: Partial<modalNames>
) => {
  const stateModals = ref<Partial<modalNames>>(defaultValue ?? {})
  const openModals = <K extends keyof modalNames>(...keys: K[]) => {
    keys.forEach((k) => (stateModals.value[k] = true))
  }

  const closeModals = <K extends keyof modalNames>(...keys: K[]) => {
    keys.forEach((k) => (stateModals.value[k] = false))
  }

  /**
   * toggle value in object ( if exists with the same value, remove it else set it)
   */
  const toggleModals = <K extends keyof modalNames>(...keys: K[]) => {
    keys.forEach((k) => {
      if (stateModals.value[k]) {
        closeModals(k)
      } else {
        openModals(k)
      }
    })
  }

  return {
    stateModals,
    openModals,
    closeModals,
    toggleModals,
  }
}

/**
 * interact with one modal
 *
 * @function
 * @name useModal
 * @kind variable
 * @param {boolean) => { stateModal} initialState?
 * @param {() => void openModal} globalThis.ComputedRef<boolean> closeModal
 * @param {(} () => void toggleModal
 * @returns {void; }}
 * @exports
 */
export const useModal = (initialState: boolean = false) => {
  const { stateModals, closeModals, openModals, toggleModals } = useModals({ base: initialState })

  const stateModal = computed(() => stateModals.value.base)
  const closeModal = () => closeModals('base')
  const openModal = () => openModals('base')
  const toggleModal = () => toggleModals('base')

  return {
    stateModal,
    closeModal,
    openModal,
    toggleModal,
  }
}

export default useModal
