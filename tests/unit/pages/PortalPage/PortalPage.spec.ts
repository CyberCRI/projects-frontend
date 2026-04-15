import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import PortalPage from '@/pages/PortalPage/PortalPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { OrganizationFactory } from '../../../factories/organization.factory'
import { PaginationsFactory } from '../../../factories/paginations.factory'

describe('PortalPage.vue', () => {
  it('should render component', async () => {
    registerEndpoint(`organization/`, () => {
      return PaginationsFactory.generate({ results: OrganizationFactory.generateMany(10) })
    })

    const wrapper = await lpiMountSuspended(PortalPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
