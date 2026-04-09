import { lpiMount } from '@/../tests/helpers/LpiMount'
import NotificationSettingsPage from '@/pages/NotificationSettingsPage/NotificationSettingsPage.vue'

import { describe, expect, it } from 'vitest'

describe('NotificationSettingsPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NotificationSettingsPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
