import { lpiMount } from '@/../tests/helpers/LpiMount'
import EventPage from '@/pages/EventPage/EventPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('EventPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(EventPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
