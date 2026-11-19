import AccountsTab from '~/pages/AdminPortalPageV2/Tabs/AccountsTab.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { OrganizationFactory } from '~~/tests/factories/organization.factory'
import useOrganizationsStore from '~/stores/useOrganizations'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import pinia from '~/stores'

describe('AccountsTab.vue', () => {
  it('should render component', async () => {
    const organizationStore = useOrganizationsStore(pinia)
    organizationStore._current = OrganizationFactory.generate()
    const wrapper = await lpiMountSuspended(AccountsTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
