import CategoriesPage from '~/pages/CategoriesPage/CategoriesPage.vue'
import { lpiShallowMountSuspended } from '~~/tests/helpers/LpiMount'
import { beforeEach, describe, expect, it } from 'vitest'

import { ProjectCategoryOutputFactory } from '~~/tests/factories/project-category.factory'

import type { OrganizationOutput } from 'shared-projects-frontend/models'
import useProjectCategoriesStore from '~/stores/useProjectCategories'
import useOrganizationsStore from '~/stores/useOrganizations'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'

describe('CategoriesPage', () => {
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore()
    organizationsStore._current = { ID: 'TEST', code: 'TEST' } as unknown as OrganizationOutput
    const projectCategories = useProjectCategoriesStore()
    projectCategories._all = ProjectCategoryOutputFactory.generateMany(8)
  })
  it('should render CategoriesPage', async () => {
    const organizationCode = useOrganizationCode()

    registerEndpoint(`organization/${organizationCode}/categories-hierarchy/`, () => {
      return ProjectCategoryOutputFactory.generate()
    })
    const wrapper = await lpiShallowMountSuspended(CategoriesPage)
    await flushPromises()

    expect(wrapper.exists()).toBeTruthy()
  })
})
