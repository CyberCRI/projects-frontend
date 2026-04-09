import { lpiMount } from '@/../tests/helpers/LpiMount'
import GalleryItem from '@/components/base/gallery/GalleryItem.vue'

import { describe, expect, it } from 'vitest'

describe('GalleryItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GalleryItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
