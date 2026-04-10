import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileSkillsEditTab from '@/pages/UserProfilePageV2/Tabs/ProfileSkillsEditTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProfileSkillsEditTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProfileSkillsEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
