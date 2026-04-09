import { lpiMount } from '@/../tests/helpers/LpiMount'
import ImageEditor from '@/components/base/form/ImageEditor.vue'

import { describe, expect, it } from 'vitest'

describe('ImageEditor.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ImageEditor, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
