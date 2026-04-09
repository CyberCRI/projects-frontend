import { lpiMount } from '@/../tests/helpers/LpiMount'
import CharCounter from '@/components/base/form/CharCounter.vue'

import { describe, expect, it } from 'vitest'

describe('CharCounter.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(CharCounter, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
