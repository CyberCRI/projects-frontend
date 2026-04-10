import { lpiMount } from '@/../tests/helpers/LpiMount'
import OrganizationResourcesPage from '@/pages/OrganizationResourcesPage/OrganizationResourcesPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('OrganizationResourcesPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(OrganizationResourcesPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
