import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import ProjectTabs from '@/components/project/ProjectTabs.vue'
import { ProjectFactory, ProjectOutputFactory } from '@/../tests/factories/project.factory'
import english from '@/locales/en.json'
import { ProjectCategoryOutputFactory } from '@/../tests/factories/project-category.factory'
import pinia from '@/stores'
import useProjectCategoriesStore from '@/stores/useProjectCategories'
import useOrganizationsStore from '@/stores/useOrganizations'
import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

const route = {
  params: {
    slugOrId: '13',
  },
}

const factory = (props?) => {
  return lpiShallowMount(ProjectTabs, {
    props: {
      project: ProjectOutputFactory.generate(),
      ...props,
    },
    i18n,
    global: {
      mocks: {
        $route: route,
      },
    },
  })
}

describe('ProjectTabs.vue', () => {
  beforeEach(() => {
    const projectCategories = useProjectCategoriesStore(pinia)
    projectCategories.all = ProjectCategoryOutputFactory.generateMany(2)
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore.current = { id: 123 } as unknown as OrganizationOutput
  })
  it('should render component', () => {
    const wrapper = factory()
    expect(wrapper.exists()).toBe(true)
  })

  it('should toggle add-to-project', () => {
    const wrapper = factory()
    const vm: any = wrapper.vm

    expect(vm.addToProjectMenuVisible).toBe(false)
    vm.toggleAddToProject()
    expect(vm.addToProjectMenuVisible).toBe(true)
    vm.toggleAddToProject()
    expect(vm.addToProjectMenuVisible).toBe(false)
  })

  it('should toggle project config', () => {
    const wrapper = factory()
    const vm: any = wrapper.vm

    vm.addToProjectMenuVisible = true
    expect(vm.addToProjectMenuVisible).toBe(true)
  })
})
