import { lpiMount } from '@/../tests/helpers/LpiMount'
import UserProfilePage from '@/pages/UserProfilePageV2/UserProfilePage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('UserProfilePage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(UserProfilePage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
