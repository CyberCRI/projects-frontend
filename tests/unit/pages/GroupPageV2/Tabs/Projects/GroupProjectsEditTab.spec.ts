import GroupProjectsEditTab from '~/pages/GroupPageV2/Tabs/Projects/GroupProjectsEditTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { groupTranslatedFactory } from '~~/tests/factories/group.factory'
import { ProjectFactory } from '~~/tests/factories/project.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

describe('GroupProjectsEditTab.vue', () => {
  it('should render component', async () => {
    const group = groupTranslatedFactory.generate()
    const props = { group }
    const organizationCode = useOrganizationCode()
    group.organization.code = organizationCode

    registerEndpoint(`organization/${organizationCode}/people-group/${group.id}/project/`, () => {
      return PaginationsFactory.generate({
        results: ProjectFactory.generateMany(10),
      })
    })

    const wrapper = await lpiMountSuspended(GroupProjectsEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
