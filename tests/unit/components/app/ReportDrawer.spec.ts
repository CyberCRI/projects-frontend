import { lpiMount } from '@/../tests/helpers/LpiMount'
import ReportDrawer from '@/components/app/ReportDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('ReportDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ReportDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
