import GroupMembersTab from '@/pages/GroupPageV2/Tabs/Members/GroupMembersTab.vue'
import { lpiMount, lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { loadLocaleMessages } from '@/../tests/helpers/loadLocaleMessages'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { groupTranslatedFactory } from '../../../../factories/group.factory'
import { flushPromises } from '@vue/test-utils'
import { register } from 'mixpanel-browser'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import GroupMemberFactory from '../../../../factories/group-member.factory'
import { ProjectFactory } from '../../../../factories/project.factory'
import nitroError from '@/server/plugins/nitroError'
import { PaginationsFactory } from '../../../../factories/paginations.factory'
const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
}

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
    await flushPromises()
    console.log(wrapper.html())
    await expect.poll(() => wrapper.findAll('.user').length).toBe(4)
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
