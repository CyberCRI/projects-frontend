import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import GroupProjectsEditTab from '@/pages/GroupPageV2/Tabs/Projects/GroupProjectsEditTab.vue'
import { flushPromises } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'
import { groupTranslatedFactory } from '../../../../../factories/group.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '../../../../../factories/paginations.factory'
import { ProjectFactory } from '../../../../../factories/project.factory'
import GroupMemberFactory from '../../../../../factories/group-member.factory'

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
