import { lpiMount } from '@/../tests/helpers/LpiMount'
import TagsTab from '@/pages/AdminPortalPageV2/Tabs/TagsTab.vue'

import { describe, expect, it } from 'vitest'

describe('TagsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TagsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
