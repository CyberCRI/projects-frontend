import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupLocationsTab from '@/pages/GroupPageV2/Tabs/Locations/GroupLocationsTab.vue'

import { describe, expect, it } from 'vitest'

describe('GroupLocationsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupLocationsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
