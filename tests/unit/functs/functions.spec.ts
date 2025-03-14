import funct from '@/functs/functions'
import FunctionImporter from './FunctionImporter.vue'
import { lpiMountExtra } from '@/../tests/helpers/LpiMount'
import { ProjectOutputFactory } from '@/../tests/factories/project.factory'
import { UserFactory } from '@/../tests/factories/user.factory'
import { test, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'
import useOrganizationsStore from '@/stores/useOrganizations'
vi.mock('@/router/index', () => ({
  default: {
    push: vi.fn(),
  },
}))

// TODO make those test useful....

describe('Function getOrgsFromRoles', () => {
  let usersStore
  beforeEach(() => {
    usersStore = useUsersStore()
  })
  it('should return empty array', () => {
    const roles = []
    const result = funct.getOrgsFromRoles(roles)

    expect(result).toEqual([])
  })

  it('should return orgs', () => {
    const roles = [
      '/ClientsAdmin',
      '/projects/ClientsAdmin',
      '/projects/organizations/CRI/administrators',
      '/projects/organizations/CRI/external',
      '/projects/organizations/OTHER_ORG/external',
    ]
    const orgs = ['CRI', 'OTHER_ORG']
    const result = funct.getOrgsFromRoles(roles)

    expect(result).toEqual(orgs)
  })
})

describe('Function projectCanBeEdited', () => {
  let usersStore
  let organizationsStore
  beforeEach(() => {
    usersStore = useUsersStore(pinia)
    organizationsStore = useOrganizationsStore(pinia)
  })
  afterEach(() => {
    usersStore.$reset()
    organizationsStore.$reset()
  })
  test('that project cannot be edited if there is no user', () => {
    usersStore.user = null // getters are writable only in tests

    const { wrapper } = lpiMountExtra(FunctionImporter)

    expect(usersStore.user).toBe(null)
  })

  test('that project can be edited if user is super-admin', () => {
    const project = {}

    const user = UserFactory.generate()
    usersStore.user = user // getters are writable only in tests

    const { wrapper } = lpiMountExtra(FunctionImporter)

    expect(usersStore.user).toBe(user)
  })

  test('that project can be edited if user is org-admin of one of the organisations the project belongs to', () => {
    const user = UserFactory.generate()
    const project = ProjectOutputFactory.generate()
    project.categories[0].organization.code = 'CRI' // Add same org code from project factory generated

    organizationsStore.current = { code: 'CRI' } // getters are writable only in tests
    usersStore.user = user // getters are writable only in tests

    const { wrapper } = lpiMountExtra(FunctionImporter)

    expect(usersStore.user).toBe(user)
  })

  test('that project cannot be edited if user is org-admin but of an organisation with no link with the project', () => {
    const user = UserFactory.generate()
    const project = ProjectOutputFactory.generate()

    usersStore.user = user // getters are writable only in tests
    usersStore.id = user.id // getters are writable only in tests

    const { wrapper } = lpiMountExtra(FunctionImporter)
    expect(usersStore.user).toBe(user)
  })

  test("that project can be edited if user is one of project's owners and project is not locked", () => {
    const user = UserFactory.generate()
    const project = ProjectOutputFactory.generate()
    project.team.members[0].group = 'owners'
    project.team.members[0].user = {
      id: 1,
    }
    project.is_locked = false

    usersStore.user = user // getters are writable only in tests
    usersStore.id = user.id // getters are writable only in tests
    const { wrapper } = lpiMountExtra(FunctionImporter)

    expect(usersStore.user).toBe(user)
  })

  test("that project cannot be edited if user is one of project's owners but project is locked", () => {
    const user = UserFactory.generate()
    const project = ProjectOutputFactory.generate()
    project.is_locked = true

    usersStore.user = user // getters are writable only in tests
    usersStore.id = user.id // getters are writable only in tests
    const { wrapper } = lpiMountExtra(FunctionImporter)
    expect(usersStore.user).toBe(user)
  })

  // TODO projects: when reviewers is added to the function update test
  // test("that project can be edited if user is one of project's reviewers", () => {
  //     const localVue = createLocalVue()
  //
  //     const project = ProjectOutputFactory.generate()
  //     const userDefined = vi.fn()
  //     userDefined.mockReturnValue(true)
  //
  //     const store = createStore({ // TODO pinia
  //         getters: {
  //             'users/user': userDefined,
  //         },
  //         state: {
  //             users: { id: '1234' },
  //         },
  //     })
  //
  //     const wrapper = mount(FunctionImporter, {
  //         localVue,
  //         store,
  //     })
  //
  //     expect(wrapper.vm.usersStore.user).toBe(true)
  //     expect(wrapper.vm.$data.funct.projectCanBeEdited(project, store)).toBe(true)
  // })

  test('that project cannot be edited if user is not super-admin and not part of the project', () => {
    const project = ProjectOutputFactory.generate()
    const user = UserFactory.generate()
    usersStore.user = user // getters are writable only in tests
    usersStore.id = user.id // getters are writable only in tests
    const { wrapper } = lpiMountExtra(FunctionImporter)
    expect(usersStore.user).toBe(user)
  })
})
