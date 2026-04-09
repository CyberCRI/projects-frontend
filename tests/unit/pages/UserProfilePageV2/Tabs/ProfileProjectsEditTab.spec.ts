import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileProjectsEditTab from '@/pages/UserProfilePageV2/Tabs/ProfileProjectsEditTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProfileProjectsEditTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProfileProjectsEditTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
