import { lpiMount } from '@/../tests/helpers/LpiMount'
import ResourcesRecap from '@/components/resources/ResourcesRecap.vue'

import { describe, expect, it } from 'vitest'

describe('ResourcesRecap.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ResourcesRecap, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
