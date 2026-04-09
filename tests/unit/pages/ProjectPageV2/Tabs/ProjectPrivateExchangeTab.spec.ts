import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectPrivateExchangeTab from '@/pages/ProjectPageV2/Tabs/ProjectPrivateExchangeTab.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectPrivateExchangeTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectPrivateExchangeTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
