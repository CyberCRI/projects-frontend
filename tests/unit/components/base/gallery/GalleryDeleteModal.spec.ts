import { lpiMount } from '@/../tests/helpers/LpiMount'
import GalleryDeleteModal from '@/components/base/gallery/GalleryDeleteModal.vue'

import { describe, expect, it } from 'vitest'

describe('GalleryDeleteModal.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GalleryDeleteModal, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
