import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import EventsList from '@/pages/CalendarPage/Tabs/EventsList.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '../../../../factories/paginations.factory'
import { EventFactory } from '../../../../factories/event.factory'

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
