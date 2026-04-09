import { lpiMount } from '@/../tests/helpers/LpiMount'
import TipTapOutput from '@/components/base/form/TextEditor/TipTapOutput.vue'

import { describe, expect, it } from 'vitest'

describe('TipTapOutput.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TipTapOutput, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
