import { lpiMount } from '@/../tests/helpers/LpiMount'
import AdminPortalPage from '@/pages/AdminPortalPageV2/AdminPortalPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('AdminPortalPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(AdminPortalPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
