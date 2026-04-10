import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectPrivateExchangeTab from '@/pages/ProjectPageV2/Tabs/ProjectPrivateExchangeTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectPrivateExchangeTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProjectPrivateExchangeTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
