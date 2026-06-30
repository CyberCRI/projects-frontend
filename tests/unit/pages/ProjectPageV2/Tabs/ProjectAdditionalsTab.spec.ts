import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import {
  ProjectTabItemFactory,
  TranslatedProjectTabFactory,
} from '~~/tests/factories/projects-tabs.factory'
import { ProjectOutputFactory, TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import ProjectAddiionalsTab from '~/pages/ProjectPageV2/Tabs/Additionals/ProjectAddiionalsTab.vue'
import ProjectSnapshotTab from '~/pages/ProjectPageV2/ProjectSnapshotTab.vue'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime'
import { UserFactory } from '~~/tests/factories/user.factory'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

const project = TranslatedProjectFactory.generate()

mockNuxtImport('useRoute', () => () => ({
  params: { slugOrId: project.id },
  path: `/projects/${project.id}/summary`,
  fullPath: `/projects/${project.id}/summary`,
  query: {},
}))

describe('ProjectPage.vue', () => {
  it('should render component Text', async () => {
    const user = UserFactory.generate()

    registerEndpoint(`user/${user.id}/`, () => user)

    const tab = TranslatedProjectTabFactory.generate({ type: 'text' })

    registerEndpoint(`project/${project.id}/tab/${tab.id}/item/`, () =>
      PaginationsFactory.generate({
        results: ProjectTabItemFactory.generateMany(10),
      })
    )

    const wrapper = await lpiMountSuspended(ProjectAddiionalsTab, {
      props: {
        project,
        tab,
      },
      stubs: { NuxtPage: ProjectSnapshotTab, NuxtLink: true },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })

  it('should render component blog', async () => {
    const user = UserFactory.generate()

    registerEndpoint(`user/${user.id}/`, () => user)

    const tab = TranslatedProjectTabFactory.generate({ type: 'blog' })

    registerEndpoint(`project/${project.id}/tab/${tab.id}/item/`, () =>
      PaginationsFactory.generate({
        results: ProjectTabItemFactory.generateMany(10),
      })
    )

    const wrapper = await lpiMountSuspended(ProjectAddiionalsTab, {
      props: {
        project,
        tab,
      },
      stubs: { NuxtPage: ProjectSnapshotTab, NuxtLink: true },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
