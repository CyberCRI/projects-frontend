import GroupProjectsTab from '~/pages/GroupPageV2/Tabs/Projects/GroupProjectsTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { groupTranslatedFactory } from '~~/tests/factories/group.factory'
import ProjectPreview from '~/components/project/ProjectPreview.vue'
import { ProjectFactory } from '~~/tests/factories/project.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

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

    const wrapper = await lpiMountSuspended(GroupProjectsTab, {
      props: {
        group,
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

    const wrapper = await lpiMountSuspended(GroupProjectsTab, {
      props: {
        group,
      },
    })

    // @ts-expect-error TS2349
    await expect.poll(() => wrapper.text()).includes('An error occured')
  })
})
