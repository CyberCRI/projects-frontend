
import { lpiMount } from '@/../tests/helpers/LpiMount'
import TotalChart from '@/components/stats/Charts/TotalChart.vue'

import { describe, expect, it } from 'vitest'

describe('TotalChart.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TotalChart, {props})
    expect(wrapper.exists()).toBe(true)
  })
})
