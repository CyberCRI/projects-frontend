import UserProfilePage from '~/pages/UserProfilePageV2/UserProfilePage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { UserFactory } from '~~/tests/factories/user.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('UserProfilePage.vue', () => {
  it('should render component', async () => {
    const user = UserFactory.generate()
    const props = { userId: user.id }

    registerEndpoint(`user/${user.id}/`, () => user)

    const wrapper = await lpiMountSuspended(UserProfilePage, {
      props,
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
