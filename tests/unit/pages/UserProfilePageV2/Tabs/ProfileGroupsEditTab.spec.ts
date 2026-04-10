import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileGroupsEditTab from '@/pages/UserProfilePageV2/Tabs/ProfileGroupsEditTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProfileGroupsEditTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProfileGroupsEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
