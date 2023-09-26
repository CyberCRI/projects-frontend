import { lpiShallowMount } from '../../../helpers/LpiMount'
import AdvancedOptions from '@/components/lpikit/AdvancedOptions/AdvancedOptions.vue'
import english from '@/locales/en.json'
import { ProjectOutputFactory } from '../../../factories/project.factory'
import { ProjectCategoryOutputFactory } from '../../../factories/project-category.factory'
import { OrganizationOutputFactory } from '../../../factories/organization.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const categories = ProjectCategoryOutputFactory.generateMany(8)
const organizations = OrganizationOutputFactory.generateMany(3)

function buildStore() {
    return {
        modules: {
            organizations: {
                namespaced: true,
                getters: {
                    all: () => {},
                    current: () => organizations[0],
                },
                actions: {
                    getAllOrganizations: vi.fn(),
                },
            },
            projectCategories: {
                namespaced: true,
                getters: {
                    allOrderedByOrderId: () => {},
                },
            },
            users: {
                namespaced: true,
                getters: {
                    user: vi.fn().mockReturnValue({ orgs: [] }),
                    kid: () => '',
                },
            },
            projects: {
                namespaced: true,
                dispatch: vi.fn(),
            },
        },
    }
}

const factory = (propsData?) => {
    const store = buildStore()

    return lpiShallowMount(AdvancedOptions, {
        props: {
            project: {
                ...ProjectOutputFactory.generate(),
                categories: ProjectCategoryOutputFactory.generateMany(3),
                organizations: [OrganizationOutputFactory.generate()],
            },
        },
        i18n,
        store,
    })
}

describe('AdvancedOptions.vue', () => {
    it('should render component', () => {
        const wrapper = factory({ categories, organizations })
        expect(wrapper.exists()).toBe(true)
    })

    it('should toggle category', () => {
        const wrapper = factory()
        const vm: any = wrapper.vm

        if (vm.selected.categories.includes('1')) {
            vm.toggleCategoryOrOrg('categories', '1')
            expect(vm.selected.categories).not.toContain('1')
            vm.toggleCategoryOrOrg('categories', '1')
            expect(vm.selected.categories).toContain('1')
        } else {
            vm.toggleCategoryOrOrg('categories', '1')
            expect(vm.selected.categories).toContain('1')
            vm.toggleCategoryOrOrg('categories', '1')
            expect(vm.selected.categories).not.toContain('1')
        }
    })

    it('should toggle organization', () => {
        const wrapper = factory()
        const vm: any = wrapper.vm

        if (vm.selected.organizations.includes('CRI')) {
            vm.toggleCategoryOrOrg('organizations', 'CRI')
            expect(vm.selected.organizations).not.toContain('CRI')
            vm.toggleCategoryOrOrg('organizations', 'CRI')
            expect(vm.selected.organizations).toContain('CRI')
        } else {
            vm.toggleCategoryOrOrg('organizations', 'CRI')
            expect(vm.selected.organizations).toContain('CRI')
            vm.toggleCategoryOrOrg('organizations', 'CRI')
            expect(vm.selected.organizations).not.toContain('CRI')
        }
    })
})
