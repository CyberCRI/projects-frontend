import { lpiMount } from '@/../tests/helpers/LpiMount'
import ImageMenuBar from '@/components/base/form/TextEditor/ImageMenuBar.vue'

import { describe, expect, it } from 'vitest'

describe('ImageMenuBar.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ImageMenuBar, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
