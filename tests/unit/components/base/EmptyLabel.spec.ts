import { lpiMount } from '@/../tests/helpers/LpiMount'
import EmptyLabel from '@/components/base/EmptyLabel.vue'

import { describe, expect, it } from 'vitest'

describe('EmptyLabel.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EmptyLabel, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
