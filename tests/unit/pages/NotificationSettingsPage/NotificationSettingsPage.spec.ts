import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import NotificationSettingsPage from '@/pages/NotificationSettingsPage/NotificationSettingsPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('NotificationSettingsPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMountSuspended(NotificationSettingsPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
