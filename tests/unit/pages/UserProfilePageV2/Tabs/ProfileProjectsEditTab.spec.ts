import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileProjectsEditTab from '@/pages/UserProfilePageV2/Tabs/ProfileProjectsEditTab.vue'
import { flushPromises } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'
import { UserFactory } from '../../../../factories/user.factory'

describe('ProfileProjectsEditTab.vue', () => {
  it('should render component', async () => {
    const user = UserFactory.generate()
    const props = { user }

    const wrapper = await lpiMount(ProfileProjectsEditTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
