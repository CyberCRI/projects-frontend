import { lpiMount } from '@/../tests/helpers/LpiMount'
import HelpTab from '@/pages/HelpPage/Tabs/HelpTab.vue'
import { flushPromises } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'

describe('HelpTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    // faked appDoc
    const runtimeConfig = useRuntimeConfig()
    runtimeConfig.public.appDoc = 'http://localhost:8000'

    const wrapper = await lpiMount(HelpTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
