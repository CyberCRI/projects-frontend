import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import EventPage from '@/pages/EventPage/EventPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { EventFactory } from '../../../factories/event.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import EventItem from '@/components/event/EventList/EventItem.vue'

describe('EventPage.vue', () => {
  it('should render component', async () => {
    const event = EventFactory.generate()
    const props = { eventId: event.id }
    const organizationCode = useOrganizationCode()

    registerEndpoint(`organization/${organizationCode}/event/${event.id}/`, () => event)

    const wrapper = await lpiMountSuspended(EventPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findComponent(EventItem).exists()).toBe(true)
  })
})
