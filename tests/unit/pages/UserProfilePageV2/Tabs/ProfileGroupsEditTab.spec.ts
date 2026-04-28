import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import ProfileGroupsEditTab from '~/pages/UserProfilePageV2/Tabs/ProfileGroupsEditTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { UserFactory } from '../../../../factories/user.factory'

describe('ProfileGroupsEditTab.vue', () => {
  it('should render component', async () => {
    const user = UserFactory.generate()
    const props = { user }

    const wrapper = await lpiMountSuspended(ProfileGroupsEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
