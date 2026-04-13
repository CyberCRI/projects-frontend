import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import SettingsTab from '@/pages/AdminPortalPageV2/Tabs/SettingsTab.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { OrganizationFactory } from '../../../../factories/organization.factory'
import useOrganizationsStore from '@/stores/useOrganizations'

describe('SettingsTab.vue', () => {
  it('should render component', async () => {
    const props = {}

    const organization = OrganizationFactory.generate()
    const store = useOrganizationsStore()
    store._current = organization
    registerEndpoint(`organization/${organization.code}/`, () => organization)

    const wrapper = await lpiMountSuspended(SettingsTab, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
