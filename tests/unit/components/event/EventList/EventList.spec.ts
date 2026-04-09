import { lpiMount } from '@/../tests/helpers/LpiMount'
import EventList from '@/components/event/EventList/EventList.vue'

import { describe, expect, it } from 'vitest'

describe('EventList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EventList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
