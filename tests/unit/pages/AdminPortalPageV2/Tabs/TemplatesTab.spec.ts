import TemplatesTab from '~/pages/AdminPortalPageV2/Tabs/TemplatesTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('TemplatesTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(TemplatesTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
