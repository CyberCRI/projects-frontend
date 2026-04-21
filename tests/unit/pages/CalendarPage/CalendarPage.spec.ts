import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import CalendarPage from '@/pages/CalendarPage/CalendarPage.vue'
import { registerEndpoint } from '@nuxt/test-utils/runtime'

import { describe, expect, it } from 'vitest'
import { PaginationsFactory } from '../../../factories/paginations.factory'
import { flushPromises } from '@vue/test-utils'
import { EventFactory } from '../../../factories/event.factory'

describe('CalendarPage.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/event/`, () => {
      return PaginationsFactory.generate({
        results: EventFactory.generateMany(10),
      })
    })

    const wrapper = await lpiMountSuspended(CalendarPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
