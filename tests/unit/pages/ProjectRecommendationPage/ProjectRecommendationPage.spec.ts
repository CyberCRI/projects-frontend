import ProjectRecommendationPage from '~/pages/ProjectRecommendationPage/ProjectRecommendationPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { ProjectFactory } from '~~/tests/factories/project.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('ProjectRecommendationPage.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/recommended-project/user/`, () => {
      return PaginationsFactory.generate({ results: ProjectFactory.generateMany(10) })
    })

    const wrapper = await lpiMountSuspended(ProjectRecommendationPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
