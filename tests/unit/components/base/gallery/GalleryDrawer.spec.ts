import { lpiMount } from '@/../tests/helpers/LpiMount'
import GalleryDrawer from '@/components/base/gallery/GalleryDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('GalleryDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GalleryDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
