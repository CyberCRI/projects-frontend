import GroupsListTab from '~/pages/AdminPortalPageV2/Tabs/GroupsListTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('GroupsListTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(GroupsListTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
