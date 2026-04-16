import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import GroupNewsTab from '@/pages/GroupPageV2/Tabs/News/GroupNewsTab.vue'
import { flushPromises } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'
import { peopleGroupFactory } from '../../../../../factories/group.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '../../../../../factories/paginations.factory'
import { NewsFactory } from '../../../../../factories/news.factory'

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
