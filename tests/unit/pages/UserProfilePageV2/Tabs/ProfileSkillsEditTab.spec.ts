import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileSkillsEditTab from '@/pages/UserProfilePageV2/Tabs/ProfileSkillsEditTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProfileSkillsEditTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProfileSkillsEditTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
