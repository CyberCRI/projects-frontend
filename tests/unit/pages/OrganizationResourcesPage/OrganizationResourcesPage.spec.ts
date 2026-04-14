// TODO rework this tests
import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import OrganizationResourcesPage from '@/pages/OrganizationResourcesPage/OrganizationResourcesPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '../../../factories/paginations.factory'
import { AttachmentFileFactory } from '../../../factories/attachment-file.factory'

describe('OrganizationResourcesPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/file/`, () => {
      return PaginationsFactory.generate({
        results: AttachmentFileFactory.generateMany(10),
      })
    })

    const wrapper = await lpiMountSuspended(OrganizationResourcesPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
