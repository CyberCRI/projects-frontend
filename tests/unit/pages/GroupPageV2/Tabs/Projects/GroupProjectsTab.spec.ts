import GroupProjectsTab from '@/pages/GroupPageV2/Tabs/Projects/GroupProjectsTab.vue'
import { lpiMount } from '@/../tests/helpers/LpiMount'
import { loadLocaleMessages } from '@/../tests/helpers/loadLocaleMessages'

import { describe, expect, it } from 'vitest'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import ProjectPreview from '@/components/project/ProjectPreview.vue'
import { groupTranslatedFactory } from '../../../../../factories/group.factory'
import { PaginationsFactory } from '../../../../../factories/paginations.factory'
import { ProjectFactory } from '../../../../../factories/project.factory'

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
    await expect.poll(() => wrapper.findAllComponents(ProjectPreview).length).toBe(4)
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
