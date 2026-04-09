import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileBioTab from '@/pages/UserProfilePageV2/Tabs/ProfileBioTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProfileBioTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProfileBioTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
