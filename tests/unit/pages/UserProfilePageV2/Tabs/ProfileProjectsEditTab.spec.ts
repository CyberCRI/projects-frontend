import ProfileProjectsEditTab from '~/pages/UserProfilePageV2/Tabs/ProfileProjectsEditTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'

import { UserFactory } from '~~/tests/factories/user.factory'
import { describe, expect, it } from 'vitest'

describe('ProfileProjectsEditTab.vue', () => {
  it('should render component', async () => {
    const user = UserFactory.generate()
    const props = { user }

    const wrapper = await lpiMountSuspended(ProfileProjectsEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
