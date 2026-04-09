import { lpiMount } from '@/../tests/helpers/LpiMount'
import HelpTab from '@/pages/HelpPage/Tabs/HelpTab.vue'

import { describe, expect, it } from 'vitest'

describe('HelpTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(HelpTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
