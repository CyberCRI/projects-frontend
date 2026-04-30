import GoalsRecap from '~/components/project/goal/GoalsRecap.vue'
import { GoalFactory } from '~~/tests/factories/goal.factory'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('GoalRecap.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()
    const goals = GoalFactory.generateMany(10)

    registerEndpoint(`project/${project.id}/goal/`, () => {
      return PaginationsFactory.generate({
        results: goals,
      })
    })

    const wrapper = await lpiMountSuspended(GoalsRecap, {
      props: {
        project,
      },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
