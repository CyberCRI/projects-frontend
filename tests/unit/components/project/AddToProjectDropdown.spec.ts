import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import AddToProjectDropdown from '@/components/project/AddToProjectDropdown.vue'
import english from '@/i18n/locales/en.json'
import utils from '@/functs/functions'
import { ProjectOutputFactory } from '@/../tests/factories/project.factory'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import useProjectsStore from '@/stores/useProjects'
import useUsersStore from '@/stores/useUsers'
vi.mock('@/functs/functions')
;(utils.hasPermission as Mock).mockImplementation(() => true)

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('AddToProjectDropdown', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    const usersStore = useUsersStore(pinia)
    usersStore.$patch({
      user: { id: 123 },
      userFromApi: { id: 123 },
      userFromToken: { id: 123 },
    } as any)

    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore.current = OrganizationOutputFactory.generate()
    const projectsStore = useProjectsStore(pinia)
    projectsStore.project = {
      ...ProjectOutputFactory.generate(),
      files: [],
      links: [],
    }
    defaultParams = {
      i18n,
      provide: {
        projectLayoutToggleAddModal: vi.fn(),
        projectLayoutGoToTab: vi.fn(),
      },
    }
  })

  it('should render AddToProjectDropdown component', () => {
    wrapper = lpiShallowMount(AddToProjectDropdown, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should render all Button components', () => {
    wrapper = lpiShallowMount(AddToProjectDropdown, defaultParams)
    const vm: any = wrapper.vm

    const buttons = wrapper.findAll('.add-to-project__button')

    expect(buttons.length).toBeGreaterThan(0)
    expect(buttons.length).toBe(vm.menuItems.length)
  })
})
