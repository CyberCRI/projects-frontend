
import { lpiMount } from '@/../tests/helpers/LpiMount'
import LpiBarChart from '@/components/stats/Charts/Generic/LpiBarChart.vue'

import { describe, expect, it } from 'vitest'

describe('LpiBarChart.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LpiBarChart, {props})
    expect(wrapper.exists()).toBe(true)
  })
})
