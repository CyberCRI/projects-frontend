import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import ProjectHeader from '@/components/project/ProjectHeaderV2.vue'
import { ProjectOutputFactory } from '@/../tests/factories/project.factory'

import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'
import useOrganizationsStore from '@/stores/useOrganizations'
import { OrganizationOutput } from '@/models/organization.model'

import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/composables/usePermissions', () => ({
  default: () => ({
    canEditProject: computed(() => true),
  }),
}))

describe('ProjectHeader.vue', () => {
  beforeEach(() => {
    const usersStore = useUsersStore(pinia)
    usersStore.$patch({
      id: 123,
      userFromApi: {},
      permissions: {},
      getUser: vi.fn(),
    } as any)
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { code: 'foo' } as unknown as OrganizationOutput
  })

  it('should render component', () => {
    const wrapper = lpiShallowMount(ProjectHeader, {
      props: {
        project: ProjectOutputFactory.generate(),
      },
      provide: {
        projectLayoutGoToTab: vi.fn(),
        projectLayoutToggleAddModal: vi.fn(),
      },
      stubs: {
        TagsList: {
          props: ['prefix'],
          template: '<div></div>',
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
