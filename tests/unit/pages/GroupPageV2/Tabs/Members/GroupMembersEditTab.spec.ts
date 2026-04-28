import GroupMembersEditTab from '~/pages/GroupPageV2/Tabs/Members/GroupMembersEditTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { groupTranslatedFactory } from '~~/tests/factories/group.factory'
import GroupMemberFactory from '~~/tests/factories/group-member.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

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
