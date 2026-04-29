import AdminPortalPage from '~/pages/AdminPortalPageV2/AdminPortalPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('AdminPortalPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(AdminPortalPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
