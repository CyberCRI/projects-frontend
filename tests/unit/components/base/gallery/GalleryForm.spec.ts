import { lpiMount } from '@/../tests/helpers/LpiMount'
import GalleryForm from '@/components/base/gallery/GalleryForm.vue'

import { describe, expect, it } from 'vitest'

describe('GalleryForm.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GalleryForm, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
