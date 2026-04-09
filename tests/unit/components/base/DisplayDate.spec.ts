import { lpiMount } from '@/../tests/helpers/LpiMount'
import DisplayDate from '@/components/base/DisplayDate.vue'

import { describe, expect, it } from 'vitest'

describe('DisplayDate.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(DisplayDate, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
