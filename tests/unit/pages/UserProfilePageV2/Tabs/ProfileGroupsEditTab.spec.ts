import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileGroupsEditTab from '@/pages/UserProfilePageV2/Tabs/ProfileGroupsEditTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProfileGroupsEditTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProfileGroupsEditTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
