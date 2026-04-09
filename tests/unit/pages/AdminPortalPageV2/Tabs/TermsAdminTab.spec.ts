import { lpiMount } from '@/../tests/helpers/LpiMount'
import TermsAdminTab from '@/pages/AdminPortalPageV2/Tabs/TermsAdminTab.vue'

import { describe, expect, it } from 'vitest'

describe('TermsAdminTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TermsAdminTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
