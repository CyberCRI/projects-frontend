import { lpiMount } from '@/../tests/helpers/LpiMount'
import DatePickerModal from '@/components/base/modal/DatePickerModal.vue'

import { describe, expect, it } from 'vitest'

describe('DatePickerModal.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(DatePickerModal, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
