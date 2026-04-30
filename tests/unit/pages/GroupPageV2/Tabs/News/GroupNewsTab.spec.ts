import GroupNewsTab from '~/pages/GroupPageV2/Tabs/News/GroupNewsTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { peopleGroupFactory } from '~~/tests/factories/group.factory'
import { NewsFactory } from '~~/tests/factories/news.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

describe('GroupNewsTab.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()
    const group = peopleGroupFactory.generate()

    registerEndpoint(`organization/${organizationCode}/people-group/${group.id}/news/`, () => {
      return PaginationsFactory.generate({
        results: NewsFactory.generateMany(10),
      })
    })

    const props = { group }

    const wrapper = await lpiMountSuspended(GroupNewsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
