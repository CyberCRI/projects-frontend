import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import ProfileBioEditTab from '@/pages/UserProfilePageV2/Tabs/ProfileBioEditTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { UserFactory } from '../../../../factories/user.factory'

describe('ProfileBioEditTab.vue', () => {
  it('should render component', async () => {
    const user = UserFactory.generate()
    const props = { user }

    const wrapper = await lpiMountSuspended(ProfileBioEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
