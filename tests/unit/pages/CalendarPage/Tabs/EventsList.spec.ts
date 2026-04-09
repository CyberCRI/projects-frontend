import { lpiMount } from '@/../tests/helpers/LpiMount'
import EventsList from '@/pages/CalendarPage/Tabs/EventsList.vue'

import { describe, expect, it } from 'vitest'

describe('EventsList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EventsList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
