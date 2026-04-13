import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import CalendarPage from '@/pages/CalendarPage/CalendarPage.vue'

import { describe, expect, it } from 'vitest'
import { MockRouter } from '../../../helpers/router'

describe('CalendarPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMountSuspended(CalendarPage, {
      props,
      router: MockRouter(),
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
