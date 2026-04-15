import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import LinkCreateTab from '@/pages/AdminPortalPageV2/Tabs/LinkCreateTab.vue'

import { beforeEach, describe, expect, it } from 'vitest'

import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'

import type { OrganizationOutput } from '@/models/organization.model'
import { flushPromises } from '@vue/test-utils'

describe('LinkCreateTab.vue', () => {
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { code: 'FOOBAR' } as unknown as OrganizationOutput
  })

  it('should mount the component', async () => {
    const wrapper = await lpiMountSuspended(LinkCreateTab)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
