import { lpiMount } from '@/../tests/helpers/LpiMount'
import IconImage from '@/components/base/media/IconImage.vue'

import { describe, expect, it } from 'vitest'

describe('IconImage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(IconImage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
