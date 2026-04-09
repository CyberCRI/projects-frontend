import { lpiMount } from '@/../tests/helpers/LpiMount'
import GalleryList from '@/components/base/gallery/GalleryList.vue'

import { describe, expect, it } from 'vitest'

describe('GalleryList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GalleryList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
