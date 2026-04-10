import { lpiMount } from '@/../tests/helpers/LpiMount'
import InstructionPage from '@/pages/InstructionPage/InstructionPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('InstructionPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(InstructionPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
