import { lpiMount } from '@/../tests/helpers/LpiMount'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'

import { describe, expect, it } from 'vitest'

describe('CroppedApiImage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(CroppedApiImage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
