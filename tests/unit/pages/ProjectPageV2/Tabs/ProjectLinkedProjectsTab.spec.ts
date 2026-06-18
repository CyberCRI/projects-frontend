import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import ProjectLinkedProjectsTab from '~/pages/ProjectPageV2/Tabs/LinkedProjects/ProjectLinkedProjectsTab.vue'
import { LinkedProjectFactory, TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectLinkedProjectsTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()

    registerEndpoint(`project/${project.id}/linked-project/`, () => {
      return PaginationsFactory.generate({
        results: LinkedProjectFactory.generateMany(10),
      })
    })

    const props = { project }

    const wrapper = await lpiMountSuspended(ProjectLinkedProjectsTab, {
      props,
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
