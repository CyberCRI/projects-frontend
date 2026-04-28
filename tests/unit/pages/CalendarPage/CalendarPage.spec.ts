import CalendarPage from '~/pages/CalendarPage/CalendarPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import { registerEndpoint } from '@nuxt/test-utils/runtime'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { EventFactory } from '~~/tests/factories/event.factory'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

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
