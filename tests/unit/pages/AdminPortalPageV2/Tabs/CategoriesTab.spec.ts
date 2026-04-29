import CategoriesTab from '~/pages/AdminPortalPageV2/Tabs/CategoriesTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('CategoriesTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(CategoriesTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
