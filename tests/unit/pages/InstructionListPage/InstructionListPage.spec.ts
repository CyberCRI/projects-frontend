import { lpiMount } from '@/../tests/helpers/LpiMount'
import InstructionListPage from '@/pages/InstructionListPage/InstructionListPage.vue'

import { describe, expect, it } from 'vitest'

describe('InstructionListPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(InstructionListPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
