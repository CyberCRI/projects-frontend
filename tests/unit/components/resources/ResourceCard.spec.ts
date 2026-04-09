import { lpiMount } from '@/../tests/helpers/LpiMount'
import ResourceCard from '@/components/resources/ResourceCard.vue'

import { describe, expect, it } from 'vitest'

describe('ResourceCard.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ResourceCard, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
