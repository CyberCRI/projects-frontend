import CategoriesPage from '@/pages/CategoriesPage/CategoriesPage.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import MockComponent from '@/../tests/helpers/MockComponent.vue'
import { beforeEach, describe, expect, it } from 'vitest'

import english from '@/i18n/locales/en.json'
import { ProjectCategoryOutputFactory } from '@/../tests/factories/project-category.factory'

import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'

import useProjectCategoriesStore from '@/stores/useProjectCategories'
import useOrganizationsStore from '@/stores/useOrganizations'
import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

const router = [{ name: 'Home', path: '/', component: MockComponent }]

describe('CategoriesPage', () => {
  beforeEach(() => {
    const usersStore = useUsersStore(pinia)
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { ID: 'TEST', code: 'TEST' } as unknown as OrganizationOutput
    const projectCategories = useProjectCategoriesStore(pinia)
    projectCategories.all.value = ProjectCategoryOutputFactory.generateMany(8)
  })
  it('should render CategoriesPage', () => {
    let wrapper = lpiShallowMount(CategoriesPage, { router, i18n })

    expect(wrapper.exists()).toBeTruthy()
  })
})
