import GroupMembersTab from '~/pages/GroupPageV2/Tabs/Members/GroupMembersTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { groupTranslatedFactory } from '~~/tests/factories/group.factory'
import GroupMemberFactory from '~~/tests/factories/group-member.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import UserCard from '~/components/people/UserCard.vue'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('GroupProjectsTab', () => {
  it('Render', async () => {
    const orgaCode = useOrganizationCode()
    const group = groupTranslatedFactory.generate()
    registerEndpoint(`organization/${orgaCode}/people-group/${group.id}/member/`, () => {
      return PaginationsFactory.generate({
        results: GroupMemberFactory.generateMany(4),
      })
    })

    const wrapper = await lpiMountSuspended(GroupMembersTab, {
      props: {
        group,
      },
    })

    // 4 number of factory
    await flushPromises()
    await expect.poll(() => wrapper.findAllComponents(UserCard).length).toBe(4)
  })

  it('Error fetch', async () => {
    const orgaCode = useOrganizationCode()
    const group = groupTranslatedFactory.generate()
    registerEndpoint(`organization/${orgaCode}/people-group/${group.id}/member/`, () => {
      throw createError({ statusCode: 500 })
    })

    const wrapper = await lpiMountSuspended(GroupMembersTab, {
      props: {
        group,
      },
    })

    await expect.poll(() => wrapper.text()).includes('An error occured')
  })
})
