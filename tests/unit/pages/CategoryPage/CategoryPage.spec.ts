import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import CategoryPage from '@/pages/CategoryPage/CategoryPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { MockRouter } from '../../../helpers/router'
import { ProjectCategoryFactory } from '../../../factories/project-category.factory'
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '../../../factories/paginations.factory'
import OrganizationTagFactory from '../../../factories/tag.factory'

const category = ProjectCategoryFactory.generate()

mockNuxtImport('useRoute', () => () => ({
  params: { slugOrId: category.id },
  query: {},
}))

describe('CategoryPage.vue', () => {
  it('should render component', async () => {
    const organizationCode = useOrganizationCode()
    registerEndpoint(`organization/${organizationCode}/category/`, () => {
      return PaginationsFactory.generate({
        results: [...OrganizationTagFactory.generateMany(9), category],
      })
    })

    const wrapper = await lpiMountSuspended(CategoryPage, { router: MockRouter() })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
