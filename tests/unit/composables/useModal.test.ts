import { describe, it, expect } from 'vitest'

describe('useModals composable', () => {
  it('default', () => {
    const { stateModals, closeModals, openModals, toggleModals, closeAllModals, setModals } =
      useModals({
        drawer: true,
        modal: false,
      })
    expect(stateModals.value.drawer).toBe(true)
    expect(stateModals.value.modal).toBe(false)

    toggleModals('drawer', 'modal')
    expect(stateModals.value.drawer).toBe(false)
    expect(stateModals.value.modal).toBe(true)

    closeModals('modal')
    expect(stateModals.value.modal).toBe(false)

    openModals('modal')
    expect(stateModals.value.modal).toBe(true)

    openModals('modal', 'drawer')
    expect(stateModals.value).toEqual({ modal: true, drawer: true })
    closeAllModals()
    expect(stateModals.value).toEqual({ modal: false, drawer: false })

    setModals('modal', false)
    expect(stateModals.value.modal).toEqual(false)
    setModals('modal', true)
    expect(stateModals.value.modal).toEqual(true)
  })
})

describe('useModal composable', () => {
  it('default', () => {
    const { stateModal, closeModal, openModal, toggleModal, setModal } = useModal(false)
    expect(stateModal.value).toBe(false)

    toggleModal()
    expect(stateModal.value).toBe(true)

    closeModal()
    expect(stateModal.value).toBe(false)

    openModal()
    expect(stateModal.value).toBe(true)

    setModal(false)
    expect(stateModal.value).toEqual(false)
    setModal(true)
    expect(stateModal.value).toEqual(true)
  })
})
