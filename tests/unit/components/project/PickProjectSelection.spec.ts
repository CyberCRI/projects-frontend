import { lpiMount } from '@/../tests/helpers/LpiMount'
import PickProjectSelection from '@/components/project/PickProjectSelection.vue'

import { describe, expect, it } from 'vitest'

describe('PickProjectSelection.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(PickProjectSelection, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
