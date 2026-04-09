import { lpiMount } from '@/../tests/helpers/LpiMount'
import TipTapModals from '@/components/base/form/TextEditor/TipTapModals.vue'

import { describe, expect, it } from 'vitest'

describe('TipTapModals.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TipTapModals, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
