import { lpiMount } from '@/../tests/helpers/LpiMount'
import InstructionPage from '@/pages/InstructionPage/InstructionPage.vue'

import { describe, expect, it } from 'vitest'

describe('InstructionPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(InstructionPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
