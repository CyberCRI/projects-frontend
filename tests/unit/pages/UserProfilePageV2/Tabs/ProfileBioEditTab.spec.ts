import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileBioEditTab from '@/pages/UserProfilePageV2/Tabs/ProfileBioEditTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProfileBioEditTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProfileBioEditTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
