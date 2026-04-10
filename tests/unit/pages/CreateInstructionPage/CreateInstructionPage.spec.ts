import { lpiMount } from '@/../tests/helpers/LpiMount'
import CreateInstructionPage from '@/pages/CreateInstructionPage/CreateInstructionPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('CreateInstructionPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(CreateInstructionPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
