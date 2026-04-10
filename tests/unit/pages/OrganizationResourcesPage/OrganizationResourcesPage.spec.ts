// TODO rework this tests
import { lpiMount } from '@/../tests/helpers/LpiMount'
import OrganizationResourcesPage from '@/pages/OrganizationResourcesPage/OrganizationResourcesPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { factoryPagination } from '@/skeletons/base.skeletons'
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

    const wrapper = await lpiMount(OrganizationResourcesPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
