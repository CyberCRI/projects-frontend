import { lpiMount } from '@/../tests/helpers/LpiMount'
import EventItem from '@/components/event/EventList/EventItem.vue'

import { describe, expect, it } from 'vitest'

describe('EventItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EventItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
