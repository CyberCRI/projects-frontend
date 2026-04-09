import { lpiMount } from '@/../tests/helpers/LpiMount'
import InstructionItem from '@/components/home/SummaryCards/InstructionItem.vue'

import { describe, expect, it } from 'vitest'

describe('InstructionItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(InstructionItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
