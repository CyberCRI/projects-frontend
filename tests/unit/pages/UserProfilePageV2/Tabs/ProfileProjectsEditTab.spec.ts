import ProfileProjectsEditTab from '~/pages/UserProfilePageV2/Tabs/ProfileProjectsEditTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'

import FollowFactory from '~~/tests/factories/follow.factory'
import { UserFactory } from '~~/tests/factories/user.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

describe('ProfileProjectsEditTab.vue', () => {
  it('should render component', async () => {
    const user = UserFactory.generate()
    const props = { user }

    registerEndpoint(`user/${user.id}/follow/`, () => {
      return FollowFactory.generateMany(5)
    })

    const wrapper = await lpiMountSuspended(ProfileProjectsEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
