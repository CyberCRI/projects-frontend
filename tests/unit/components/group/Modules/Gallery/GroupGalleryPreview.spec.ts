import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupGalleryPreview from '@/components/group/Modules/Gallery/GroupGalleryPreview.vue'

import { describe, expect, it } from 'vitest'

describe('GroupGalleryPreview.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupGalleryPreview, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
