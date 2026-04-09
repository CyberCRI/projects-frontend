import { lpiMount } from '@/../tests/helpers/LpiMount'
import CategoriesTab from '@/pages/AdminPortalPageV2/Tabs/CategoriesTab.vue'

import { describe, expect, it } from 'vitest'

describe('CategoriesTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(CategoriesTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
