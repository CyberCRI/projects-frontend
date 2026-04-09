import { lpiMount } from '@/../tests/helpers/LpiMount'
import EditEventDrawer from '@/components/event/EditEventDrawer/EditEventDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('EditEventDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EditEventDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
