// TODO rework this tests
import OrganizationResourcesPage from '~/pages/OrganizationResourcesPage/OrganizationResourcesPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { AttachmentFileFactory } from '~~/tests/factories/attachment-file.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('OrganizationResourcesPage.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/file/`, () => {
      return PaginationsFactory.generate({
        results: AttachmentFileFactory.generateMany(10),
      })
    })

    const wrapper = await lpiMountSuspended(OrganizationResourcesPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
