import UserRecommendationPage from '~/pages/UserRecommendationPage/UserRecommendationPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { UserFactory } from '~~/tests/factories/user.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('UserRecommendationPage.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/recommended-user/user/`, () => {
      return PaginationsFactory.generate({ results: UserFactory.generateMany(10) })
    })

    const wrapper = await lpiMountSuspended(UserRecommendationPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
