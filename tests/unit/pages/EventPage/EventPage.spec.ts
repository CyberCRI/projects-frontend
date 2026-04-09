import { lpiMount } from '@/../tests/helpers/LpiMount'
import EventPage from '@/pages/EventPage/EventPage.vue'

import { describe, expect, it } from 'vitest'

describe('EventPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EventPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
