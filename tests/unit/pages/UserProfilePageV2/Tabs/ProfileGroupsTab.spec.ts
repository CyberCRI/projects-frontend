import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileGroupsTab from '@/pages/UserProfilePageV2/Tabs/ProfileGroupsTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProfileGroupsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProfileGroupsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
