import { lpiMount } from '@/../tests/helpers/LpiMount'
import EventsList from '@/pages/CalendarPage/Tabs/EventsList.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('EventsList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(EventsList, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
