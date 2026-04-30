import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import EventPage from '~/pages/EventPage/EventPage.vue'

import EventItem from '~/components/event/EventList/EventItem.vue'
import { EventFactory } from '~~/tests/factories/event.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

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
