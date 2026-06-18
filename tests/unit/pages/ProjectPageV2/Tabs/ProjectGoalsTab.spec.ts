import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import ProjectGoalsTab from '~/pages/ProjectPageV2/Tabs/Goals/ProjectGoalsTab.vue'
import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { factoryPagination } from '~/skeletons/base.skeletons'
import { GoalFactory } from '~~/tests/factories/goal.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectGoalsTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()

    registerEndpoint(`project/${project.id}/goal/`, () => {
      return PaginationsFactory.generate({
        results: GoalFactory.generateMany(10),
      })
    })

    const props = { project }

    const wrapper = await lpiMountSuspended(ProjectGoalsTab, {
      props,
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
