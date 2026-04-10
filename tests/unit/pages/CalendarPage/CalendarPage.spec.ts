import { lpiMount } from '@/../tests/helpers/LpiMount'
import CalendarPage from '@/pages/CalendarPage/CalendarPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('CalendarPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(CalendarPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
