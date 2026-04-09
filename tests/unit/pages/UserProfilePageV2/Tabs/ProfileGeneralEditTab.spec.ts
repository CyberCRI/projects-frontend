import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileGeneralEditTab from '@/pages/UserProfilePageV2/Tabs/ProfileGeneralEditTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProfileGeneralEditTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProfileGeneralEditTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
