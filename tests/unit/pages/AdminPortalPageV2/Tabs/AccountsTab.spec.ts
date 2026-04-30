import AccountsTab from '~/pages/AdminPortalPageV2/Tabs/AccountsTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('AccountsTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(AccountsTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
