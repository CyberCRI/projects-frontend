import { lpiMount } from '@/../tests/helpers/LpiMount'
import InstructionAdminBlock from '@/components/admin/GeneralAdminBlocks/Instructions/InstructionAdminBlock.vue'

import { describe, expect, it } from 'vitest'

describe('InstructionAdminBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(InstructionAdminBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
