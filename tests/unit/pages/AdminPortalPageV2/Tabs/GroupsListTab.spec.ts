import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import GroupsListTab from '~/pages/AdminPortalPageV2/Tabs/GroupsListTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('GroupsListTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(GroupsListTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
