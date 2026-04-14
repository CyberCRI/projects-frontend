import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import CalendarPage from '@/pages/CalendarPage/CalendarPage.vue'

import { describe, expect, it } from 'vitest'

describe('CalendarPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMountSuspended(CalendarPage, {
      props,
      global: {
        mocks: {
          $route: {
            path: '',
            matched: [],
          },
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
