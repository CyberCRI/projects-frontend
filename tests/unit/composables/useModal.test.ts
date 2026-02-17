import { describe, it, expect } from 'vitest'
import { ref, computed } from 'vue'
import useAsyncAPI from '@/composables/useAsyncAPI'
import flushPromises from 'flush-promises'

describe('useModals composable', () => {
  it('default', () => {
    const { stateModals, closeModals, openModals, toggleModals } = useModals({
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
  })
})

describe('useModal composable', () => {
  it('default', () => {
    const { stateModal, closeModal, openModal, toggleModal } = useModal(false)
    expect(stateModal.value).toBe(false)

    toggleModal()
    expect(stateModal.value).toBe(true)

    closeModal()
    expect(stateModal.value).toBe(false)

    openModal()
    expect(stateModal.value).toBe(true)
  })
})
