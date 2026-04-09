import { lpiMount } from '@/../tests/helpers/LpiMount'
import LinkedProjectDrawer from '@/components/project/linked-project/LinkedProjectDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('LinkedProjectDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LinkedProjectDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
