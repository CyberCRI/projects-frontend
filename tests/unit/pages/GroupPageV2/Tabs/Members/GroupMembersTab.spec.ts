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
  const orgaCode = useOrganizationCode()

  it('Render', async () => {
    const group = groupTranslatedFactory.generate()
    registerEndpoint(`organization/${orgaCode}/people-group/${group.id}/member/`, () => {
      return PaginationsFactory.generate({
        results: [
          GroupMemberFactory.generate(),
          GroupMemberFactory.generate(),
          GroupMemberFactory.generate(),
          GroupMemberFactory.generate(),
        ],
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
    const group = groupTranslatedFactory.generate()
    registerEndpoint(`organization/${orgaCode}/people-group/${group.id}/member/`, () => {
      throw createError({ statusCode: 500 })
    })

    const wrapper = await lpiMountSuspended(GroupMembersTab, {
      props: {
        group,
      },
    })

    // @ts-expect-error TS2349
    await expect.poll(() => wrapper.text()).includes('An error occured')
  })
})
