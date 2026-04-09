import { lpiMount } from '@/../tests/helpers/LpiMount'
import DescriptionCropped from '@/components/base/DescriptionCropped.vue'

import { describe, expect, it } from 'vitest'

describe('DescriptionCropped.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(DescriptionCropped, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
