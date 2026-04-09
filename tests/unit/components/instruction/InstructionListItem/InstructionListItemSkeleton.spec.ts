import { lpiMount } from '@/../tests/helpers/LpiMount'
import InstructionListItemSkeleton from '@/components/instruction/InstructionListItem/InstructionListItemSkeleton.vue'

import { describe, expect, it } from 'vitest'

describe('InstructionListItemSkeleton.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(InstructionListItemSkeleton, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
