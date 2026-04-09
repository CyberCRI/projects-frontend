import { lpiMount } from '@/../tests/helpers/LpiMount'
import EventSummaryBlock from '@/components/home/SummaryCards/EventSummaryBlock.vue'

import { describe, expect, it } from 'vitest'

describe('EventSummaryBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EventSummaryBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
