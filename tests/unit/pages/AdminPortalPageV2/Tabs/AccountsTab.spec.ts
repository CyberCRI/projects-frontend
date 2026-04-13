import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import AccountsTab from '@/pages/AdminPortalPageV2/Tabs/AccountsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('AccountsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMountSuspended(AccountsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
