import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupsTab from '@/pages/AdminPortalPageV2/Tabs/GroupsTab.vue'

import { describe, expect, it } from 'vitest'
import { MockRouter } from '../../../../helpers/router'
import { flushPromises } from '@vue/test-utils'

describe('GroupsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(GroupsTab, { props, router: MockRouter() })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
