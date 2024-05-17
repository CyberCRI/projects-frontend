import { lpiMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import GoalDrawer from '@/components/project/goal/GoalDrawer.vue'
import { describe, expect, it } from 'vitest'
import { ProjectFactory, ProjectOutputFactory } from '../../../../tests/factories/project.factory'
import { OrganizationOutputFactory } from '../../../../tests/factories/organization.factory'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const project = ProjectOutputFactory.generate()

const store = {
    modules: {
        projects: {
            namespaced: true,
            getters: {
                project: () => ({
                    ...ProjectOutputFactory.generate(),
                    files: [],
                    links: [],
                }),
                currentProjectSlug: vi.fn(() => project.slug),
            },
        },
        goals: {
            namespaced: true,
            actions: {
                patchGoal: vi.fn(),
                createGoal: vi.fn(),
            },
        },
        notifications: {
            namespaced: true,
            actions: {
                pushToast: vi.fn(),
            },
        },
    },
}

describe('GoalDrawer.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            store,
        }
    })

    it('should render GoalDrawer component', () => {
        wrapper = lpiMount(GoalDrawer, defaultParams)
        expect(wrapper.exists()).toBe(true)
    }),
        it('should emit the close event', () => {
            wrapper = lpiMount(GoalDrawer, defaultParams)
            const vm: any = wrapper.vm

            vm.closeModalNoConfirm()
            expect(wrapper.emitted('close')).toBeTruthy()
        })
})
