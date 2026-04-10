import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileBioEditTab from '@/pages/UserProfilePageV2/Tabs/ProfileBioEditTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProfileBioEditTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProfileBioEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
