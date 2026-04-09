import { lpiMount } from '@/../tests/helpers/LpiMount'
import NewInformationTab from '@/pages/AdminPortalPageV2/Tabs/NewInformationTab.vue'

import { describe, expect, it } from 'vitest'

describe('NewInformationTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NewInformationTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
