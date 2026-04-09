import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupDocumentsTab from '@/pages/GroupPageV2/Tabs/Documents/GroupDocumentsTab.vue'

import { describe, expect, it } from 'vitest'

describe('GroupDocumentsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GroupDocumentsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
