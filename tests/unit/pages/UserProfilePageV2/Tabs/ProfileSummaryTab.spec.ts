import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileSummaryTab from '@/pages/UserProfilePageV2/Tabs/ProfileSummaryTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProfileSummaryTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProfileSummaryTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
