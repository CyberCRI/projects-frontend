import { lpiMount } from '@/../tests/helpers/LpiMount'
import UserProfilePage from '@/pages/UserProfilePageV2/UserProfilePage.vue'

import { describe, expect, it } from 'vitest'

describe('UserProfilePage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(UserProfilePage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
