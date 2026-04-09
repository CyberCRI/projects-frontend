import { lpiMount } from '@/../tests/helpers/LpiMount'
import AccountsTab from '@/pages/AdminPortalPageV2/Tabs/AccountsTab.vue'

import { describe, expect, it } from 'vitest'

describe('AccountsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(AccountsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
