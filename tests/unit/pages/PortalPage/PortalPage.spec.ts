import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import PortalPage from '~/pages/PortalPage/PortalPage.vue'

import { OrganizationFactory } from '~~/tests/factories/organization.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

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
