import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileResourcesTab from '@/pages/UserProfilePageV2/Tabs/ProfileResourcesTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProfileResourcesTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProfileResourcesTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
