import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import UserProfilePage from '@/pages/UserProfilePageV2/UserProfilePage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { UserFactory } from '../../../factories/user.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { MockRouter } from '../../../helpers/router'

describe('UserProfilePage.vue', () => {
  it('should render component', async () => {
    const user = UserFactory.generate()
    const props = { userId: user.id }

    registerEndpoint(`user/${user.id}/`, () => user)

    const wrapper = await lpiMountSuspended(UserProfilePage, {
      props,
      router: MockRouter(),
      global: {
        mocks: {
          $route: {
            name: 'ProfileSummaryOther',
          },
        },
      },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
