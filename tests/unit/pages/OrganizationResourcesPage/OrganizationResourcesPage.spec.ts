import { lpiMount } from '@/../tests/helpers/LpiMount'
import OrganizationResourcesPage from '@/pages/OrganizationResourcesPage/OrganizationResourcesPage.vue'

import { describe, expect, it } from 'vitest'

describe('OrganizationResourcesPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(OrganizationResourcesPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
