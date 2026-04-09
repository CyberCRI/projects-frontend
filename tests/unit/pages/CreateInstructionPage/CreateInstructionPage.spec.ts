import { lpiMount } from '@/../tests/helpers/LpiMount'
import CreateInstructionPage from '@/pages/CreateInstructionPage/CreateInstructionPage.vue'

import { describe, expect, it } from 'vitest'

describe('CreateInstructionPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(CreateInstructionPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
