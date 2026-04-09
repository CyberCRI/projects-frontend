import { lpiMount } from '@/../tests/helpers/LpiMount'
import EventAdminBlock from '@/components/admin/GeneralAdminBlocks/Events/EventAdminBlock.vue'

import { describe, expect, it } from 'vitest'

describe('EventAdminBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EventAdminBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
