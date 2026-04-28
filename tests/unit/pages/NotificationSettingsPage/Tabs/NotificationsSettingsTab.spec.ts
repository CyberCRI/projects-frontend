import NotificationsSettingsTab from '~/pages/NotificationSettingsPage/Tabs/NotificationsSettingsTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('NotificationsSettingsTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(NotificationsSettingsTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
