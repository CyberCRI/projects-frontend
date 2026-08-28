import NotificationSettingsPage from '~/pages/NotificationSettingsPage/NotificationSettingsPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { NotificationSettingsFactory } from '~~/tests/factories/notifications.factory'
import { UserFactory } from '~~/tests/factories/user.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import useUsersStore from '~/stores/useUserStore'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('NotificationSettingsPage.vue', () => {
  it('should render component', async () => {
    const user = UserFactory.generate()
    const userStore = useUsersStore()
    registerEndpoint(`user/${user.id}/`, () => user)
    registerEndpoint(`notifications-setting/${user.id}/`, () =>
      NotificationSettingsFactory.generate()
    )
    userStore.userFromApi = userStore.userFromToken = user

    const wrapper = await lpiMountSuspended(NotificationSettingsPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
