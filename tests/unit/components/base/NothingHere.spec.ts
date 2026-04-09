import { lpiMount } from '@/../tests/helpers/LpiMount'
import NothingHere from '@/components/base/NothingHere.vue'

import { describe, expect, it } from 'vitest'

describe('NothingHere.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NothingHere, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
