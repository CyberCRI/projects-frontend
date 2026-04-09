import { lpiMount } from '@/../tests/helpers/LpiMount'
import InstructionForm from '@/components/instruction/InstructionForm/InstructionForm.vue'

import { describe, expect, it } from 'vitest'

describe('InstructionForm.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(InstructionForm, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
