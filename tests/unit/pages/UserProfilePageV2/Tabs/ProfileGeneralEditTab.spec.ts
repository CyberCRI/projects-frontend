import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileGeneralEditTab from '@/pages/UserProfilePageV2/Tabs/ProfileGeneralEditTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProfileGeneralEditTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProfileGeneralEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
