import SettingsTab from '~/pages/AdminPortalPageV2/Tabs/SettingsTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { OrganizationFactory } from '~~/tests/factories/organization.factory'
import useOrganizationsStore from '~/stores/useOrganizations'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('SettingsTab.vue', () => {
  it('should render component', async () => {
    const organization = OrganizationFactory.generate()
    const store = useOrganizationsStore()
    store._current = organization
    registerEndpoint(`organization/${organization.code}/`, () => organization)

    const wrapper = await lpiMountSuspended(SettingsTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
