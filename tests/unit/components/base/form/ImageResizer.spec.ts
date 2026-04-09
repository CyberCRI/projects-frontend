import { lpiMount } from '@/../tests/helpers/LpiMount'
import ImageResizer from '@/components/base/form/ImageResizer.vue'

import { describe, expect, it } from 'vitest'

describe('ImageResizer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ImageResizer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
