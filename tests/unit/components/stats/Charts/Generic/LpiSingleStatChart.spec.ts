
import { lpiMount } from '@/../tests/helpers/LpiMount'
import LpiSingleStatChart from '@/components/stats/Charts/Generic/LpiSingleStatChart.vue'

import { describe, expect, it } from 'vitest'

describe('LpiSingleStatChart.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LpiSingleStatChart, {props})
    expect(wrapper.exists()).toBe(true)
  })
})
