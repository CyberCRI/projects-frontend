// TODO mock category endpoints
import CreateProjectPage from '~/pages/CreateProjectPage/CreateProjectPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import OrganizationTagFactory from '~~/tests/factories/tag.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('CreateProjectPage.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/category/`, () => {
      return PaginationsFactory.generate({
        results: OrganizationTagFactory.generateMany(10),
      })
    })

    const wrapper = await lpiMountSuspended(CreateProjectPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
