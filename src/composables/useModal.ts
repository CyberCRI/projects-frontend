/**
 * interacte with multiple modals
 *
 * @constant
 * @name useModal
 * @kind variable
 * @type {<modalNames = { [key: string]: boolean; }>(defaultValue: Partial<modalNames>) => { stateModal: [Partial<modalNames>] extends [globalThis.Ref<any, any>] ? IfAny<globalThis.Ref<any, any> & Partial<modalNames>, globalThis.Ref<globalThis.Ref<any, any> & Partial<modalNames>, globalThis.Ref<any, any> & Partial<modalNames>>, globalThis.Ref<any, any> & Partial<modalNames>> : globalThis.Ref<...>; openModal: <K extends keyof modalNames>(key: K) => void; closeModal: <K extends keyof modalNames>(key: K) => void; toggleModal: <K extends keyof modalNames>(key: K) => void; }}
 * @exports
 */
const useModal = <modalNames = { [key: string]: boolean }>(defaultValue: Partial<modalNames>) => {
  const stateModal = ref<Partial<modalNames>>(defaultValue ?? {})
  const openModal = <K extends keyof modalNames>(key: K) => {
    stateModal.value[key] = true
  }

  const closeModal = <K extends keyof modalNames>(key: K) => {
    stateModal.value[key] = false
  }

  /**
   * toggle value in object ( if exists with the same value, remove it else set it)
   */
  const toggleModal = <K extends keyof modalNames>(key: K) => {
    if (stateModal.value[key]) {
      closeModal(key)
    } else {
      openModal(key)
    }
  }

  return {
    stateModal,
    openModal,
    closeModal,
    toggleModal,
  }
}

export default useModal
