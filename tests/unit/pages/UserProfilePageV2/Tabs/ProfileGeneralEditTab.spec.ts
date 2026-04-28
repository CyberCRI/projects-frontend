import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import ProfileGeneralEditTab from '~/pages/UserProfilePageV2/Tabs/ProfileGeneralEditTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { UserFactory } from '../../../../factories/user.factory'

describe('ProfileGeneralEditTab.vue', () => {
  it('should render component', async () => {
    const user = UserFactory.generate()
    const props = { user }

    const wrapper = await lpiMountSuspended(ProfileGeneralEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
