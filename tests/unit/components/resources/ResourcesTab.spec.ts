import { lpiMount } from '@/../tests/helpers/LpiMount'
import ResourcesTab from '@/components/resources/ResourcesTab.vue'

import { describe, expect, it } from 'vitest'

describe('ResourcesTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ResourcesTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
