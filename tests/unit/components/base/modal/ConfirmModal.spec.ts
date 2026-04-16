import { lpiMount } from '@/../tests/helpers/LpiMount'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'

import { describe, expect, it } from 'vitest'

describe('ConfirmModal.vue', () => {
  it('should render ConfirmModal component', () => {
    const wrapper = lpiMount(ConfirmModal)
    expect(wrapper.exists()).toBe(true)
  })
})
