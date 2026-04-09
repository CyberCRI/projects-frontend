
import { lpiMount } from '@/../tests/helpers/LpiMount'
import LpiLineChart from '@/components/stats/Charts/Generic/LpiLineChart.vue'

import { describe, expect, it } from 'vitest'

describe('LpiLineChart.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LpiLineChart, {props})
    expect(wrapper.exists()).toBe(true)
  })
})
