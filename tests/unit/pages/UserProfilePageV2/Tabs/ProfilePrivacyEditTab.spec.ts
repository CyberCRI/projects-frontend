import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfilePrivacyEditTab from '@/pages/UserProfilePageV2/Tabs/ProfilePrivacyEditTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProfilePrivacyEditTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProfilePrivacyEditTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
