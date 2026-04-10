import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfilePrivacyEditTab from '@/pages/UserProfilePageV2/Tabs/ProfilePrivacyEditTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProfilePrivacyEditTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProfilePrivacyEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
