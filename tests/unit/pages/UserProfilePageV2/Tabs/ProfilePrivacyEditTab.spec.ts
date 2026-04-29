import ProfilePrivacyEditTab from '~/pages/UserProfilePageV2/Tabs/ProfilePrivacyEditTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { UserFactory } from '~~/tests/factories/user.factory'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('ProfilePrivacyEditTab.vue', () => {
  it('should render component', async () => {
    const user = UserFactory.generate()
    const props = { user }

    const wrapper = await lpiMountSuspended(ProfilePrivacyEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
