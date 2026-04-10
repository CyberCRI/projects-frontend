// TODO mock category endpoints
import { lpiMount } from '@/../tests/helpers/LpiMount'
import CreateProjectPage from '@/pages/CreateProjectPage/CreateProjectPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '../../../factories/paginations.factory'
import OrganizationTagFactory from '../../../factories/tag.factory'

describe('CreateProjectPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/category/`, () => {
      return PaginationsFactory.generate({
        results: OrganizationTagFactory.generateMany(10),
      })
    })

    const wrapper = await lpiMount(CreateProjectPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
