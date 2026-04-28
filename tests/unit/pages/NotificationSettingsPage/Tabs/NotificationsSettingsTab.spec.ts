import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import NotificationsSettingsTab from '~/pages/NotificationSettingsPage/Tabs/NotificationsSettingsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('NotificationsSettingsTab.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(NotificationsSettingsTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
