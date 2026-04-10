import { lpiMount } from '@/../tests/helpers/LpiMount'
import HelpTab from '@/pages/HelpPage/Tabs/HelpTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('HelpTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(HelpTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
