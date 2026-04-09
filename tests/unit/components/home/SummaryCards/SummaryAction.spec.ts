import { lpiMount } from '@/../tests/helpers/LpiMount'
import SummaryAction from '@/components/home/SummaryCards/SummaryAction.vue'

import { describe, expect, it } from 'vitest'

describe('SummaryAction.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SummaryAction, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
