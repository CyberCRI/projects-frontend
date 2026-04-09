import { lpiMount } from '@/../tests/helpers/LpiMount'
import InstructionListItem from '@/components/instruction/InstructionListItem/InstructionListItem.vue'

import { describe, expect, it } from 'vitest'

describe('InstructionListItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(InstructionListItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
