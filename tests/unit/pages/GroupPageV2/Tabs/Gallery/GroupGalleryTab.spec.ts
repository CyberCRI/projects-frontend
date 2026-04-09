import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupGalleryTab from '@/pages/GroupPageV2/Tabs/Gallery/GroupGalleryTab.vue'

import { describe, expect, it } from 'vitest'

describe('GroupGalleryTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupGalleryTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
