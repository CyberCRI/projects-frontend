import funct from '@/functs/functions'
import FunctionImporter from './FunctionImporter.vue'
import { lpiMountExtra } from '../../helpers/LpiMount'
import { ProjectOutputFactory } from '../../factories/project.factory'
import { UserFactory } from '../../factories/user.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/router/index', () => ({
    default: {
        push: vi.fn(),
    },
}))

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
    test('that project cannot be edited if there is no user', () => {
        const userDefined = vi.fn()
        userDefined.mockReturnValue(null)

        const _store = {
            getters: {
                'users/user': userDefined,
            },
        }

        const { wrapper, store } = lpiMountExtra(FunctionImporter, {
            store: _store,
        })

        expect(store.getters['users/user']).toBe(null)
    })

    test('that project can be edited if user is super-admin', () => {
        const project = {}

        const userDefined = vi.fn()
        userDefined.mockReturnValue(true)

        const _store = {
            getters: {
                'users/user': userDefined,
            },
        }

        const { wrapper, store } = lpiMountExtra(FunctionImporter, {
            store: _store,
        })

        expect(store.getters['users/user']).toBe(true)
    })

    test('that project can be edited if user is org-admin of one of the organisations the project belongs to', () => {
        const user = UserFactory.generate()
        const project = ProjectOutputFactory.generate()
        project.categories[0].organization.code = 'CRI' // Add same org code from project factory generated

        const userDefined = vi.fn()
        userDefined.mockReturnValue(user)

        const _store = {
            getters: {
                'users/user': userDefined,
                'organizations/current': vi.fn(() => ({
                    code: 'CRI',
                })),
            },
        }

        const { wrapper, store } = lpiMountExtra(FunctionImporter, {
            store: _store,
        })

        expect(store.getters['users/user']).toBe(user)
    })

    test('that project cannot be edited if user is org-admin but of an organisation with no link with the project', () => {
        const user = UserFactory.generate()
        const project = ProjectOutputFactory.generate()

        const userDefined = vi.fn()
        userDefined.mockReturnValue(user)

        const _store = {
            state: {
                users: {
                    id: user.id,
                },
            },
            getters: {
                'users/user': userDefined,
            },
        }

        const { wrapper, store } = lpiMountExtra(FunctionImporter, {
            store: _store,
        })
        expect(store.getters['users/user']).toBe(user)
    })

    // TODO Projects: FIX ONCE API USES KEYCLOAK_ID
    test("that project can be edited if user is one of project's owners and project is not locked", () => {
        const user = UserFactory.generate()
        const project = ProjectOutputFactory.generate()
        project.team.members[0].group = 'owners'
        project.team.members[0].user = {
            id: 1,
        }
        project.is_locked = false

        const userDefined = vi.fn()
        userDefined.mockReturnValue(user)

        const _store = {
            getters: {
                'users/user': userDefined,
                id: () => user.id,
            },
        }
        const { wrapper, store } = lpiMountExtra(FunctionImporter, {
            store: _store,
        })

        expect(store.getters['users/user']).toBe(user)
    })

    test("that project cannot be edited if user is one of project's owners but project is locked", () => {
        const project = ProjectOutputFactory.generate()
        project.is_locked = true
        const userDefined = vi.fn()
        userDefined.mockReturnValue(true)

        const _store = {
            getters: {
                'users/user': userDefined,
            },
            state: {
                users: { id: '1234' },
            },
        }

        const { wrapper, store } = lpiMountExtra(FunctionImporter, {
            store: _store,
        })
        expect(store.getters['users/user']).toBe(true)
    })

    // TODO projects: when reviewers is added to the function update test
    // test("that project can be edited if user is one of project's reviewers", () => {
    //     const localVue = createLocalVue()
    //
    //     const project = ProjectOutputFactory.generate()
    //     const userDefined = vi.fn()
    //     userDefined.mockReturnValue(true)
    //
    //     const store = createStore({
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
    //     expect(wrapper.vm.$store.getters['users/user']).toBe(true)
    //     expect(wrapper.vm.$data.funct.projectCanBeEdited(project, store)).toBe(true)
    // })

    test('that project cannot be edited if user is not super-admin and not part of the project', () => {
        const project = ProjectOutputFactory.generate()
        const user = UserFactory.generate()
        const userDefined = vi.fn()
        userDefined.mockReturnValue(user)

        const _store = {
            getters: {
                'users/user': userDefined,
            },
            state: {
                users: { id: user.id },
            },
        }

        const { wrapper, store } = lpiMountExtra(FunctionImporter, {
            store: _store,
        })
        expect(store.getters['users/user']).toBe(user)
    })
})
