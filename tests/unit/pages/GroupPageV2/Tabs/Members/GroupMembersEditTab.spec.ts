import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import GroupMembersEditTab from '@/pages/GroupPageV2/Tabs/Members/GroupMembersEditTab.vue'

import { describe, expect, it } from 'vitest'
import { groupTranslatedFactory } from '../../../../../factories/group.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '../../../../../factories/paginations.factory'
import { ProjectFactory } from '../../../../../factories/project.factory'
import GroupMemberFactory from '../../../../../factories/group-member.factory'
import flushPromises from 'flush-promises'

describe('GroupMembersEditTab.vue', () => {
  it('should render component', async () => {
    const group = groupTranslatedFactory.generate()
    const props = { group }
    const organizationCode = useOrganizationCode()
    group.organization.code = organizationCode

    registerEndpoint(`organization/${organizationCode}/people-group/${group.id}/member/`, () => {
      return PaginationsFactory.generate({
        results: GroupMemberFactory.generateMany(10),
      })
    })

    const wrapper = await lpiMountSuspended(GroupMembersEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
