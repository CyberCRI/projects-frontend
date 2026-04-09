import { lpiMount } from '@/../tests/helpers/LpiMount'
import DescriptionPlaceholder from '@/components/project/description/DescriptionPlaceholder.vue'

import { describe, expect, it } from 'vitest'

describe('DescriptionPlaceholder.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(DescriptionPlaceholder, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
