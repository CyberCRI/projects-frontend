import { lpiMount } from '@/../tests/helpers/LpiMount'
import NotificationsSettingsTab from '@/pages/NotificationSettingsPage/Tabs/NotificationsSettingsTab.vue'

import { describe, expect, it } from 'vitest'

describe('NotificationsSettingsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NotificationsSettingsTab, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
