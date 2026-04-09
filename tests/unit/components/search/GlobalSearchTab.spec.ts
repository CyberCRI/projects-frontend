import { lpiMount } from '@/../tests/helpers/LpiMount'
import GlobalSearchTab from '@/components/search/GlobalSearchTab.vue'

import { describe, expect, it } from 'vitest'

describe('GlobalSearchTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(GlobalSearchTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
