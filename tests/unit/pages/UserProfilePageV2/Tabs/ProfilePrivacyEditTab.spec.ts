import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import ProfilePrivacyEditTab from '~/pages/UserProfilePageV2/Tabs/ProfilePrivacyEditTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { UserFactory } from '../../../../factories/user.factory'

describe('ProfilePrivacyEditTab.vue', () => {
  it('should render component', async () => {
    const user = UserFactory.generate()
    const props = { user }

    const wrapper = await lpiMountSuspended(ProfilePrivacyEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
