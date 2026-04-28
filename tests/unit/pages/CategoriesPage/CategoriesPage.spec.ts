import CategoriesPage from '~/pages/CategoriesPage/CategoriesPage.vue'
import { lpiShallowMountSuspended } from '~~/tests/helpers/LpiMount'
import MockComponent from '~~/tests/helpers/MockComponent.vue'
import { beforeEach, describe, expect, it } from 'vitest'

import { ProjectCategoryOutputFactory } from '~~/tests/factories/project-category.factory'

import pinia from '~/stores'

import useProjectCategoriesStore from '~/stores/useProjectCategories'
import { OrganizationOutput } from '~/models/organization.model'
import useOrganizationsStore from '~/stores/useOrganizations'
import { flushPromises } from '@vue/test-utils'

const router = [{ name: 'Home', path: '/', component: MockComponent }]

describe('CategoriesPage', () => {
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { ID: 'TEST', code: 'TEST' } as unknown as OrganizationOutput
    const projectCategories = useProjectCategoriesStore(pinia)
    projectCategories._all = ProjectCategoryOutputFactory.generateMany(8)
  })
  it('should render CategoriesPage', async () => {
    const wrapper = await lpiShallowMountSuspended(CategoriesPage, { router })
    await flushPromises()

    expect(wrapper.exists()).toBeTruthy()
  })
})
