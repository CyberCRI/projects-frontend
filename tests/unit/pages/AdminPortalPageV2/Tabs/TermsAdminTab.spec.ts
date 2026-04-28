import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import TermsAdminTab from '~/pages/AdminPortalPageV2/Tabs/TermsAdminTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('TermsAdminTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(TermsAdminTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
