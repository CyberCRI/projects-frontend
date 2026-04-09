import { lpiMount } from '@/../tests/helpers/LpiMount'
import BaseListSummaryBlock from '@/components/home/SummaryCards/BaseListSummaryBlock.vue'

import { describe, expect, it } from 'vitest'

describe('BaseListSummaryBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(BaseListSummaryBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
