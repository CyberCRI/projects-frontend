import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileProjectTab from '@/pages/UserProfilePageV2/Tabs/ProfileProjectTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProfileProjectTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProfileProjectTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
