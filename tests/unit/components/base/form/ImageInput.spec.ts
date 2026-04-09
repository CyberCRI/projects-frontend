import { lpiMount } from '@/../tests/helpers/LpiMount'
import ImageInput from '@/components/base/form/ImageInput.vue'

import { describe, expect, it } from 'vitest'

describe('ImageInput.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ImageInput, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
