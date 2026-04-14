import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import GroupsTab from '@/pages/AdminPortalPageV2/Tabs/GroupsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('GroupsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMountSuspended(GroupsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
