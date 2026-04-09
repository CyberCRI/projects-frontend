import { lpiMount } from '@/../tests/helpers/LpiMount'
import OrganizationResourceDrawer from '@/components/project/resource/OrganizationResourceDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('OrganizationResourceDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(OrganizationResourceDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
