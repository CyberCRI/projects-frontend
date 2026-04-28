import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { ProjectCategoryFactory } from '~~/tests/factories/project-category.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime'
import OrganizationTagFactory from '~~/tests/factories/tag.factory'
import CategoryPage from '~/pages/CategoryPage/CategoryPage.vue'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

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

    const wrapper = await lpiMountSuspended(CategoryPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
