import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileSkillTab from '@/pages/UserProfilePageV2/Tabs/ProfileSkillTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProfileSkillTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProfileSkillTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
