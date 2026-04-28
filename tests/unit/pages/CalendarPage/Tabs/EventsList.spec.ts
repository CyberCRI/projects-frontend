import EventsList from '~/pages/CalendarPage/Tabs/EventsList.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { EventFactory } from '~~/tests/factories/event.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('EventsList.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()

    registerEndpoint(`organization/${organizationCode}/event/`, () => {
      return PaginationsFactory.generate({
        results: EventFactory.generateMany(10),
      })
    })

    const wrapper = await lpiMountSuspended(EventsList)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
