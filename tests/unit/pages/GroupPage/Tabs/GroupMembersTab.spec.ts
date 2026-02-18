import GroupMembersTab from '@/pages/GroupPageV2/Tabs/Members/GroupMembersTab.vue'
import { lpiMount } from '@/../tests/helpers/LpiMount'

import { describe, expect, it } from 'vitest'
import { groupTranslatedFactory } from '../../../../factories/group.factory'
import { flushPromises } from '@vue/test-utils'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import GroupMemberFactory from '../../../../factories/group-member.factory'
import { PaginationsFactory } from '../../../../factories/paginations.factory'
import UserCard from '@/components/people/UserCard.vue'

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

    const wrapper = lpiMount(GroupMembersTab, {
      props: {
        group,
        isLoading: false,
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

    const wrapper = lpiMount(GroupMembersTab, {
      props: {
        group,
        isLoading: false,
      },
    })

    // @ts-expect-error TS2349
    await expect.poll(() => wrapper.text()).includes('An error occured')
  })
})
