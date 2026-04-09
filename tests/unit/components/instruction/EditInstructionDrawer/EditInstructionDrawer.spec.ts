import { lpiMount } from '@/../tests/helpers/LpiMount'
import EditInstructionDrawer from '@/components/instruction/EditInstructionDrawer/EditInstructionDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('EditInstructionDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EditInstructionDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
