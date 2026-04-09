import { lpiMount } from '@/../tests/helpers/LpiMount'
import InstructionSummaryBlock from '@/components/home/SummaryCards/InstructionSummaryBlock.vue'

import { describe, expect, it } from 'vitest'

describe('InstructionSummaryBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(InstructionSummaryBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
