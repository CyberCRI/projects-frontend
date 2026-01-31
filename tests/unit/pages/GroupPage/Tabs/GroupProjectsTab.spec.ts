import GroupProjectsTab from '@/pages/GroupPageV2/Tabs/Projects/GroupProjectsTab.vue'
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
    registerEndpoint(`organization/${orgaCode}/people-group/${group.id}/project/`, () => {
      return PaginationsFactory.generate({
        results: [
          ProjectFactory.generate(),
          ProjectFactory.generate(),
          ProjectFactory.generate(),
          ProjectFactory.generate(),
        ],
      })
    })

    const wrapper = lpiMount(GroupProjectsTab, {
      props: {
        group,
        isLoading: false,
      },
    })

    // 4 number of factory
    await expect.poll(() => wrapper.findAll("[data-test^='project-card-']").length).toBe(4)
  })

  it('Error fetch', async () => {
    const group = groupTranslatedFactory.generate()
    registerEndpoint(`organization/${orgaCode}/people-group/${group.id}/project/`, () => {
      throw createError({ statusCode: 500 })
    })

    const wrapper = lpiMount(GroupProjectsTab, {
      props: {
        group,
        isLoading: false,
      },
    })

    // @ts-expect-error TS2349
    await expect.poll(() => wrapper.text()).includes('An error occured')
  })
})
