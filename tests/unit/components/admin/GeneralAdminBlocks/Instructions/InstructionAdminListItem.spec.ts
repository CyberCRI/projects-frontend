import { lpiMount } from '@/../tests/helpers/LpiMount'
import InstructionAdminListItem from '@/components/admin/GeneralAdminBlocks/Instructions/InstructionAdminListItem.vue'

import { describe, expect, it } from 'vitest'

describe('InstructionAdminListItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(InstructionAdminListItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
