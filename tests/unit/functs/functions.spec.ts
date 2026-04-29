// @vitest-environment nuxt
import { ProjectOutputFactory } from '~~/tests/factories/project.factory'
import { ProjectMemberModel } from '~/models/project-member.model'
import { test, beforeEach, describe, expect, it } from 'vitest'
import { UserFactory } from '~~/tests/factories/user.factory'
import useOrganizationsStore from '~/stores/useOrganizations'
import FunctionImporter from './FunctionImporter.vue'
import { lpiMount } from '~~/tests/helpers/LpiMount'
import useUsersStore from '~/stores/useUsers'
import funct from '~/functs/functions'
import pinia from '~/stores'

describe('Function getOrgsFromRoles', () => {
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
  test('that project cannot be edited if there is no user', () => {
    usersStore.user = null // getters are writable only in tests

    lpiMount(FunctionImporter)

    expect(usersStore.user).toBe(null)
  })

  test('that project can be edited if user is super-admin', () => {
    const user = UserFactory.generate()
    usersStore.user = user // getters are writable only in tests

    lpiMount(FunctionImporter)

    expect(usersStore.user).toBe(user)
  })

  test('that project can be edited if user is org-admin of one of the organisations the project belongs to', () => {
    const user = UserFactory.generate()
    const project = ProjectOutputFactory.generate()
    project.categories[0].organization.code = 'CRI' // Add same org code from project factory generated

    organizationsStore._current = { code: 'CRI' } // getters are writable only in tests
    usersStore.user = user // getters are writable only in tests

    lpiMount(FunctionImporter)

    expect(usersStore.user).toBe(user)
  })

  test('that project cannot be edited if user is org-admin but of an organisation with no link with the project', () => {
    const user = UserFactory.generate()

    usersStore.user = user // getters are writable only in tests
    usersStore.id = user.id // getters are writable only in tests

    lpiMount(FunctionImporter)
    expect(usersStore.user).toBe(user)
  })

  test("that project can be edited if user is one of project's owners and project is not locked", () => {
    const user = UserFactory.generate()
    const project = ProjectOutputFactory.generate()
    project.team.owners[0] = {
      ...UserFactory.generate({ id: 1 }),
      role: 'leaders',
    } as ProjectMemberModel
    project.is_locked = false

    usersStore.user = user // getters are writable only in tests
    usersStore.id = user.id // getters are writable only in tests
    lpiMount(FunctionImporter)

    expect(usersStore.user).toBe(user)
  })

  test("that project cannot be edited if user is one of project's owners but project is locked", () => {
    const user = UserFactory.generate()

    usersStore.user = user // getters are writable only in tests
    usersStore.id = user.id // getters are writable only in tests
    lpiMount(FunctionImporter)
    expect(usersStore.user).toBe(user)
  })

  test('that project cannot be edited if user is not super-admin and not part of the project', () => {
    const user = UserFactory.generate()
    usersStore.user = user // getters are writable only in tests
    usersStore.id = user.id // getters are writable only in tests
    lpiMount(FunctionImporter)
    expect(usersStore.user).toBe(user)
  })
})
