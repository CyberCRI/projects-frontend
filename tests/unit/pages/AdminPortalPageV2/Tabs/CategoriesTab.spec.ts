import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import CategoriesTab from '~/pages/AdminPortalPageV2/Tabs/CategoriesTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('CategoriesTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(CategoriesTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
