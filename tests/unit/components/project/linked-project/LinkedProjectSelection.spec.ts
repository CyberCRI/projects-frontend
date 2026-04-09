import { lpiMount } from '@/../tests/helpers/LpiMount'
import LinkedProjectSelection from '@/components/project/linked-project/LinkedProjectSelection.vue'

import { describe, expect, it } from 'vitest'

describe('LinkedProjectSelection.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LinkedProjectSelection, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
