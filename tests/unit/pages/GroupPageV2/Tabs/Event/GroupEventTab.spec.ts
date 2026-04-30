import GroupEventTab from '~/pages/GroupPageV2/Tabs/Event/GroupEventTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { peopleGroupFactory } from '~~/tests/factories/group.factory'
import { EventFactory } from '~~/tests/factories/event.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

describe('GroupEventTab.vue', () => {
  it('should render component', async () => {
    const group = peopleGroupFactory.generate()
    const props = {
      group,
    }

    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/people-group/${group.id}/event/`, () => {
      return PaginationsFactory.generate({
        results: EventFactory.generateMany(10),
      })
    })

    const wrapper = await lpiMountSuspended(GroupEventTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
