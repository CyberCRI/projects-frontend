import NotificationSettingsPage from '~/pages/NotificationSettingsPage/NotificationSettingsPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('NotificationSettingsPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(NotificationSettingsPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
